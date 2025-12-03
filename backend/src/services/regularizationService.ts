import RegularizationRequest from '../models/RegularizationRequest.ts';
import Employee from '../models/Employee.ts';
import { NotFoundError, BadRequestError } from '../utils/errors.ts';
import type { IRegularizationRequest } from '../models/RegularizationRequest.ts';

interface CreateRegularizationRequestData {
  employeeId: string;
  attendanceDate: Date;
  reason: string;
  requestedChanges: Array<{
    type: 'add_punch' | 'modify_punch' | 'delete_punch' | 'adjust_time';
    logId?: string;
    newTimestamp?: Date;
    newPunchStatus?: number;
    note?: string;
  }>;
  created_by: string;
}

class RegularizationService {
  // Create regularization request
  async createRequest(data: CreateRegularizationRequestData) {
    // Verify employee exists
    const employee = await Employee.findById(data.employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Validate requested changes
    if (!data.requestedChanges || data.requestedChanges.length === 0) {
      throw new BadRequestError('At least one change must be requested');
    }

    const request = await RegularizationRequest.create({
      employeeId: data.employeeId,
      attendanceDate: data.attendanceDate,
      reason: data.reason,
      requestedChanges: data.requestedChanges,
      status: 'pending',
      created_by: data.created_by,
    });

    return request.toObject();
  }

  // Get all requests with filters
  async getRequests(filters: {
    employeeId?: string;
    status?: 'pending' | 'approved' | 'rejected';
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    skip?: number;
  }) {
    const query: any = {};

    if (filters.employeeId) {
      query.employeeId = filters.employeeId;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      query.attendanceDate = {};
      if (filters.startDate) {
        query.attendanceDate.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.attendanceDate.$lte = filters.endDate;
      }
    }

    const requests = await RegularizationRequest.find(query)
      .populate('employeeId', 'first_name last_name employee_code')
      .populate('created_by', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(filters.limit || 50)
      .skip(filters.skip || 0)
      .lean();

    const total = await RegularizationRequest.countDocuments(query);

    return {
      requests,
      total,
      limit: filters.limit || 50,
      skip: filters.skip || 0,
    };
  }

  // Get request by ID
  async getRequestById(id: string) {
    const request = await RegularizationRequest.findById(id)
      .populate('employeeId', 'first_name last_name employee_code')
      .populate('created_by', 'firstName lastName email')
      .populate('reviewedBy', 'firstName lastName email')
      .lean();

    if (!request) {
      throw new NotFoundError('Regularization request not found');
    }

    return request;
  }

  // Update request
  async updateRequest(id: string, data: Partial<CreateRegularizationRequestData>, userId: string) {
    const request = await RegularizationRequest.findById(id);

    if (!request) {
      throw new NotFoundError('Regularization request not found');
    }

    // Only allow updates if status is pending
    if (request.status !== 'pending') {
      throw new BadRequestError('Cannot update request that is not pending');
    }

    // Only the creator can update
    if (request.created_by.toString() !== userId) {
      throw new BadRequestError('You can only update your own requests');
    }

    if (data.reason) request.reason = data.reason;
    if (data.requestedChanges) request.requestedChanges = data.requestedChanges as any;

    await request.save();
    return request.toObject();
  }

  // Approve request
  async approveRequest(id: string, adminId: string, reviewNote?: string) {
    const request = await RegularizationRequest.findById(id);

    if (!request) {
      throw new NotFoundError('Regularization request not found');
    }

    if (request.status !== 'pending') {
      throw new BadRequestError('Request is not pending');
    }

    request.status = 'approved';
    request.reviewedBy = adminId as any;
    request.reviewedAt = new Date();
    if (reviewNote) request.reviewNote = reviewNote;

    await request.save();
    return request.toObject();
  }

  // Reject request
  async rejectRequest(id: string, adminId: string, reviewNote: string) {
    const request = await RegularizationRequest.findById(id);

    if (!request) {
      throw new NotFoundError('Regularization request not found');
    }

    if (request.status !== 'pending') {
      throw new BadRequestError('Request is not pending');
    }

    request.status = 'rejected';
    request.reviewedBy = adminId as any;
    request.reviewedAt = new Date();
    request.reviewNote = reviewNote;

    await request.save();
    return request.toObject();
  }
}

export default new RegularizationService();


