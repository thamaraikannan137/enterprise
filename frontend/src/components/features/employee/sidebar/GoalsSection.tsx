import { MuiCard } from '../../../common';
import { BarChart } from '@mui/icons-material';
import { LinearProgress } from '@mui/material';
import type { EmployeeWithDetails } from '../../../../types/employee';

interface GoalsSectionProps {
  employee: EmployeeWithDetails;
}

export const GoalsSection = ({ employee }: GoalsSectionProps) => {
  // Mock goals data - replace with actual data
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-green-600';
      case 'at-risk':
        return 'text-yellow-600';
      case 'behind':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'behind':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <MuiCard className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals</h3>
      <div className="space-y-4">
        {goals.map((goal) => {
          const percentage = Math.round((goal.completed / goal.total) * 100);
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-start gap-2">
                <BarChart className="text-pink-500 mt-1" fontSize="small" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {goal.title}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusDot(goal.status)}`}
                    />
                    <span className={`text-xs font-medium ${getStatusColor(goal.status)}`}>
                      {goal.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>
                        {goal.completed}/{goal.total} completed
                      </span>
                      <span className="text-green-600 font-medium">
                        +{goal.change}%
                      </span>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#e5e7eb',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#10b981',
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </MuiCard>
  );
};









