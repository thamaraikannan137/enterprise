import { MuiCard, MuiButton } from '../../../common';
import { Edit, Add } from '@mui/icons-material';
import { LinearProgress } from '@mui/material';
import type { EmployeeWithDetails } from '../../../../types/employee';

interface GoalsTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

export const GoalsTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: GoalsTabProps) => {
  // Mock goals data
  const goals = [
    {
      id: 1,
      title: 'Digital transformation of all onboarding processes',
      completed: 23,
      total: 45,
      status: 'on-track',
      change: 12,
    },
  ];

  return (
    <div className="space-y-6">
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Goals</h3>
          <div className="flex gap-2">
            <MuiButton
              size="small"
              variant="outlined"
              startIcon={<Add />}
            >
              Add Goal
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
        <div className="space-y-4">
          {goals.map((goal) => {
            const percentage = Math.round((goal.completed / goal.total) * 100);
            return (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-base font-medium text-gray-900">
                    {goal.title}
                  </h4>
                  <span className="text-xs text-green-600 font-medium">
                    +{goal.change}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      {goal.completed}/{goal.total} completed
                    </span>
                    <span className="font-medium">{percentage}%</span>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e5e7eb',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#10b981',
                      },
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-green-600 font-medium">
                      ON TRACK
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </MuiCard>
    </div>
  );
};




