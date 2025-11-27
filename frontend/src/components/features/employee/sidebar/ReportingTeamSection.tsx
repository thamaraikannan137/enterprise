import { MuiCard } from '../../../common';
import { Avatar } from '@mui/material';
import type { EmployeeWithDetails } from '../../../../types/employee';

interface ReportingTeamSectionProps {
  employee: EmployeeWithDetails;
}

export const ReportingTeamSection = ({
  employee,
}: ReportingTeamSectionProps) => {
  // Mock reporting team data - replace with actual data
  const teamMembers = [
    {
      id: 1,
      name: 'Victor Pacheco',
      designation: 'Senior Engineer',
      avatar: '',
    },
    {
      id: 2,
      name: 'Angela Longoria',
      designation: 'Full Stack Developer',
      avatar: '',
    },
    {
      id: 3,
      name: 'Tikhon Yaroslavsky',
      designation: 'Web Developer',
      avatar: '',
    },
  ];

  return (
    <MuiCard className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Reporting Team ({teamMembers.length})
        </h3>
      </div>
      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <Avatar
              src={member.avatar}
              alt={member.name}
              sx={{ width: 40, height: 40 }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {member.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {member.designation}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all
        </button>
      </div>
    </MuiCard>
  );
};



