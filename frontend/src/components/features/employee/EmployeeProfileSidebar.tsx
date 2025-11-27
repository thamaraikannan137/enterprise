import { TimelineSection } from './sidebar/TimelineSection';
import { ReportingTeamSection } from './sidebar/ReportingTeamSection';
import type { EmployeeWithDetails } from '../../../types/employee';

interface EmployeeProfileSidebarProps {
  employee: EmployeeWithDetails;
}

export const EmployeeProfileSidebar = ({
  employee,
}: EmployeeProfileSidebarProps) => {
  return (
    <div className="space-y-6">
      <TimelineSection employee={employee} />
      <ReportingTeamSection employee={employee} />
    </div>
  );
};

