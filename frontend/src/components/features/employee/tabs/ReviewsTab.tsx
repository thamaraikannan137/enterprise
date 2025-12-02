import { MuiCard, MuiButton } from '../../../common';
import { Edit, Add } from '@mui/icons-material';
import type { EmployeeWithDetails } from '../../../../types/employee';

interface ReviewsTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

export const ReviewsTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: ReviewsTabProps) => {
  return (
    <div className="space-y-6">
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance Reviews</h3>
          <div className="flex gap-2">
            <MuiButton
              size="small"
              variant="outlined"
              startIcon={<Add />}
            >
              Add Review
            </MuiButton>
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
        </div>
        <div className="text-gray-500">
          Performance reviews and feedback will be displayed here.
        </div>
      </MuiCard>
    </div>
  );
};









