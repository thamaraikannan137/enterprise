import { useState } from 'react';
import { MuiInput, MuiButton } from '../../common';
import type { EmployeeStatus } from '../../../types/employee';

interface EmployeeFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    status?: EmployeeStatus;
  }) => void;
  onReset: () => void;
}

export const EmployeeFilters = ({ onFilterChange, onReset }: EmployeeFiltersProps) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<EmployeeStatus | ''>('');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({
      search: value || undefined,
      status: status || undefined,
    });
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value as EmployeeStatus | '';
    setStatus(newStatus);
    onFilterChange({
      search: search || undefined,
      status: newStatus || undefined,
    });
  };

  const handleReset = () => {
    setSearch('');
    setStatus('');
    onReset();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MuiInput
          type="text"
          label="Search"
          placeholder="Search by name or employee code"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>

        <div className="flex items-end">
          <MuiButton
            variant="outlined"
            onClick={handleReset}
            className="w-full"
          >
            Reset Filters
          </MuiButton>
        </div>
      </div>
    </div>
  );
};








