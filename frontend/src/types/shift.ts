export interface Shift {
  id: string;
  name: string;
  startTime: string; // "14:00" (HH:mm format)
  endTime: string; // "23:00"
  breakDuration: number; // in hours
  effectiveDuration: number; // in hours
  halfDayDuration: number; // in hours
  presentHours: number; // Minimum hours for "Present"
  halfDayHours: number; // Minimum hours for "Half Day"
  isActive: boolean;
  locationId?: string;
  created_by?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftInput {
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
}

