import { useParams } from 'react-router-dom';
import type { EmployeeWithDetails } from '../../../../types/employee';
import { PrimaryDetailsSection } from './sections/PrimaryDetailsSection';
import { ContactDetailsSection } from './sections/ContactDetailsSection';
import { AddressesSection } from './sections/AddressesSection';
import { FamilyDetailsSection } from './sections/FamilyDetailsSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { IdentitySection } from './sections/IdentitySection';
import { SkillsSection } from './sections/SkillsSection';

interface AboutTabProps {
  employee: EmployeeWithDetails;
}

export const AboutTab = ({
  employee,
}: AboutTabProps) => {
  const { id: employeeIdFromUrl } = useParams<{ id: string }>();
  const employeeId = employee?.id || employeeIdFromUrl;

  if (!employeeId) {
    return <div className="text-red-500">Error: Employee ID is missing</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PrimaryDetailsSection employee={employee} employeeId={employeeId} />
      <ContactDetailsSection employee={employee} employeeId={employeeId} />
      <AddressesSection employee={employee} employeeId={employeeId} />
      <FamilyDetailsSection employee={employee} employeeId={employeeId} />
      <ExperienceSection employee={employee} employeeId={employeeId} />
      <EducationSection employee={employee} employeeId={employeeId} />
      <IdentitySection employee={employee} employeeId={employeeId} />
      <SkillsSection employee={employee} employeeId={employeeId} />
    </div>
  );
};
