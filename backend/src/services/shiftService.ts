import Shift from '../models/Shift.ts';
import { NotFoundError, BadRequestError } from '../utils/errors.ts';

interface CreateShiftData {
  name: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  effectiveDuration: number;
  halfDayDuration: number;
  presentHours: number;
  halfDayHours: number;
  isActive?: boolean;
  locationId?: string;
  created_by?: string;
}

class ShiftService {
  async createShift(data: CreateShiftData) {
    const shift = await Shift.create(data);
    return shift.toObject();
  }

  async getShifts(filters?: { isActive?: boolean; locationId?: string }) {
    const query: any = {};
    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    if (filters?.locationId) {
      query.locationId = filters.locationId;
    }

    const shifts = await Shift.find(query).sort({ name: 1 });
    // Convert to plain objects and ensure id field exists
    return shifts.map((shift) => {
      const shiftObj = shift.toObject();
      // Ensure id field is set (toJSON transform should handle this, but just in case)
      if (!shiftObj.id && shiftObj._id) {
        shiftObj.id = shiftObj._id.toString();
      }
      return shiftObj;
    });
  }

  async getShiftById(id: string) {
    const shift = await Shift.findById(id);
    if (!shift) {
      throw new NotFoundError('Shift not found');
    }
    const shiftObj = shift.toObject();
    // Ensure id field is set
    if (!shiftObj.id && shiftObj._id) {
      shiftObj.id = shiftObj._id.toString();
    }
    return shiftObj;
  }

  async updateShift(id: string, data: Partial<CreateShiftData>) {
    const shift = await Shift.findById(id);
    if (!shift) {
      throw new NotFoundError('Shift not found');
    }

    // Update only provided fields
    if (data.name !== undefined) shift.name = data.name;
    if (data.startTime !== undefined) shift.startTime = data.startTime;
    if (data.endTime !== undefined) shift.endTime = data.endTime;
    if (data.breakDuration !== undefined) shift.breakDuration = data.breakDuration;
    if (data.effectiveDuration !== undefined) shift.effectiveDuration = data.effectiveDuration;
    if (data.halfDayDuration !== undefined) shift.halfDayDuration = data.halfDayDuration;
    if (data.presentHours !== undefined) shift.presentHours = data.presentHours;
    if (data.halfDayHours !== undefined) shift.halfDayHours = data.halfDayHours;
    if (data.isActive !== undefined) shift.isActive = data.isActive;
    if (data.locationId !== undefined) shift.locationId = data.locationId as any;

    await shift.save();
    return shift.toObject();
  }

  async deleteShift(id: string) {
    const shift = await Shift.findByIdAndDelete(id);
    if (!shift) {
      throw new NotFoundError('Shift not found');
    }
    return { message: 'Shift deleted successfully' };
  }
}

export default new ShiftService();

