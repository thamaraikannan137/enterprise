import { MuiCard, MuiButton } from '../../../common';
import { Add } from '@mui/icons-material';
import type { EmployeeWithDetails } from '../../../../types/employee';

interface PraiseSectionProps {
  employee: EmployeeWithDetails;
}

export const PraiseSection = ({ employee }: PraiseSectionProps) => {
  // Mock praise data - replace with actual data
  const praises = [
    {
      id: 1,
      name: 'Money Maker Medal',
      icon: '💰',
      count: 2,
      color: 'purple',
    },
    {
      id: 2,
      name: 'Relentless Cogwheel',
      icon: '⚙️',
      count: 1,
      color: 'green',
    },
    {
      id: 3,
      name: 'Problem Solver',
      icon: '#',
      count: 5,
      color: 'blue',
    },
    {
      id: 4,
      name: 'Torch Bearer',
      icon: '🔥',
      count: 1,
      color: 'orange',
    },
  ];

  return (
    <MuiCard className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Praise</h3>
        <MuiButton
          size="small"
          variant="outlined"
          startIcon={<Add />}
          className="text-xs"
        >
          Give Praise
        </MuiButton>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {praises.map((praise) => (
          <div
            key={praise.id}
            className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
          >
            <div className="text-2xl mb-1">{praise.icon}</div>
            <div className="text-xs font-medium text-gray-900 text-center mb-1">
              {praise.name}
            </div>
            <div className="text-xs text-gray-500">{praise.count}</div>
          </div>
        ))}
      </div>
    </MuiCard>
  );
};


