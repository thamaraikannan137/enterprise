import { MuiCard, MuiButton } from '../../../common';
import { Edit } from '@mui/icons-material';
import type { EmployeeWithDetails } from '../../../../types/employee';

interface TimeTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

export const TimeTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: TimeTabProps) => {
  return (
    <div className="space-y-6">
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Time & Attendance</h3>
          {!isEditMode && (
            <MuiButton
              size="small"
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => onEditModeChange(true)}
            >
              Edit
            </MuiButton>
          )}
        </div>
        <div className="text-gray-500">
          Time tracking, leave management, and attendance records will be displayed here.
        </div>
      </MuiCard>
    </div>
  );
};


