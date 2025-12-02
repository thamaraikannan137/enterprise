export interface Holiday {
  id: string;
  date: string; // ISO date string
  name: string;
  type: 'National' | 'Regional' | 'Company';
  isActive: boolean;
  locationId?: string;
  created_by?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHolidayInput {
  date: string;
  name: string;
  type: 'National' | 'Regional' | 'Company';
  isActive?: boolean;
  locationId?: string;
}

