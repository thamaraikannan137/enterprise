import { MuiCard } from '../../common';
import type { Employee } from '../../../types/employee';

interface EmployeeCardProps {
  employee: Employee;
  onClick?: () => void;
}

export const EmployeeCard = ({ employee, onClick }: EmployeeCardProps) => {
  const fullName = `${employee.first_name} ${employee.middle_name ? employee.middle_name + ' ' : ''}${employee.last_name}`;
  
  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MuiCard
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{fullName}</h3>
          <p className="text-sm text-gray-500">{employee.employee_code}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}
        >
          {employee.status}
        </span>
      </div>
      
      <div className="space-y-1 text-sm text-gray-600">
        <p>
          <span className="font-medium">Nationality:</span> {employee.nationality}
        </p>
        <p>
          <span className="font-medium">Gender:</span> {employee.gender}
        </p>
        <p>
          <span className="font-medium">Hire Date:</span>{' '}
          {new Date(employee.hire_date).toLocaleDateString()}
        </p>
      </div>
    </MuiCard>
  );
};





