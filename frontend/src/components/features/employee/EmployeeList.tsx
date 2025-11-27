import { useState } from 'react';
import { EmployeeCard } from './EmployeeCard';
import { EmployeeTable } from './EmployeeTable';
import { MuiButton } from '../../common';
import type { Employee } from '../../../types/employee';

interface EmployeeListProps {
  employees: Employee[];
  loading?: boolean;
  onEmployeeClick?: (employee: Employee) => void;
  onCreateClick?: () => void;
  viewMode?: 'card' | 'table';
}

export const EmployeeList = ({
  employees,
  loading = false,
  onEmployeeClick,
  onCreateClick,
  viewMode = 'table',
}: EmployeeListProps) => {
  const [currentViewMode, setCurrentViewMode] = useState<'card' | 'table'>(viewMode);

  const handleCreateClick = () => {
    if (onCreateClick) {
      onCreateClick();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
        <div className="flex gap-2">
          <MuiButton
            variant={currentViewMode === 'table' ? 'contained' : 'outlined'}
            onClick={() => setCurrentViewMode('table')}
          >
            Table
          </MuiButton>
          <MuiButton
            variant={currentViewMode === 'card' ? 'contained' : 'outlined'}
            onClick={() => setCurrentViewMode('card')}
          >
            Cards
          </MuiButton>
          <MuiButton 
            onClick={handleCreateClick}
            disabled={!onCreateClick}
          >
            Create Employee
          </MuiButton>
        </div>
      </div>

      {currentViewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onClick={() => onEmployeeClick?.(employee)}
            />
          ))}
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onRowClick={onEmployeeClick}
          loading={loading}
        />
      )}
    </div>
  );
};


