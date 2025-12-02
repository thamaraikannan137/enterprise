export interface RegularizationRequest {
  id: string;
  employeeId: string | {
    id: string;
    first_name: string;
    last_name: string;
    employee_code: string;
  };
  attendanceDate: string;
  attendanceSummaryId?: string;
  reason: string;
  requestedChanges: Array<{
    type: 'add_punch' | 'modify_punch' | 'delete_punch' | 'adjust_time';
    logId?: string;
    newTimestamp?: string;
    newPunchStatus?: number;
    note?: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string | {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reviewedAt?: string;
  reviewNote?: string;
  created_by: string | {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegularizationRequest {
  employeeId: string;
  attendanceDate: string;
  reason: string;
  requestedChanges: Array<{
    type: 'add_punch' | 'modify_punch' | 'delete_punch' | 'adjust_time';
    logId?: string;
    newTimestamp?: string;
    newPunchStatus?: number;
    note?: string;
  }>;
}

export interface RegularizationRequestsResponse {
  requests: RegularizationRequest[];
  total: number;
  limit: number;
  skip: number;
}

