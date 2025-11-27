import { useMemo } from 'react';
import { Chip } from '@mui/material';
import { DataTable, type Column } from '../../common';
import type { Employee } from '../../../types/employee';

interface EmployeeTableProps {
  employees: Employee[];
  onRowClick?: (employee: Employee) => void;
  loading?: boolean;
}

export const EmployeeTable = ({ employees, onRowClick, loading = false }: EmployeeTableProps) => {
  const getStatusColor = (status: Employee['status']): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'terminated':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns: Column<Employee>[] = useMemo(
    () => [
      {
        id: 'employee_code',
        label: 'Employee Code',
        minWidth: 120,
        sortable: true,
        filterable: true,
      },
      {
        id: 'name',
        label: 'Name',
        minWidth: 200,
        sortable: true,
        filterable: true,
        format: (value, row) => {
          const fullName = `${row.first_name} ${row.middle_name ? row.middle_name + ' ' : ''}${row.last_name}`;
          return fullName.trim();
        },
      },
      {
        id: 'designation',
        label: 'Designation',
        minWidth: 150,
        sortable: true,
        filterable: true,
      },
      {
        id: 'department',
        label: 'Department',
        minWidth: 150,
        sortable: true,
        filterable: true,
      },
      {
        id: 'nationality',
        label: 'Nationality',
        minWidth: 120,
        sortable: true,
        filterable: true,
      },
      {
        id: 'gender',
        label: 'Gender',
        minWidth: 100,
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' },
        ],
        format: (value) => String(value).charAt(0).toUpperCase() + String(value).slice(1),
      },
      {
        id: 'hire_date',
        label: 'Hire Date',
        minWidth: 120,
        sortable: true,
        format: (value) => {
          if (!value) return '';
          return new Date(value as string).toLocaleDateString();
        },
      },
      {
        id: 'status',
        label: 'Status',
        minWidth: 120,
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'terminated', label: 'Terminated' },
        ],
        format: (value) => {
          const status = value as Employee['status'];
          return (
            <Chip
              label={status}
              color={getStatusColor(status)}
              size="small"
              sx={{ textTransform: 'capitalize' }}
            />
          );
        },
      },
      {
        id: 'reportingToEmployee',
        label: 'Reports To',
        minWidth: 150,
        format: (value, row) => {
          if (row.reportingToEmployee) {
            return `${row.reportingToEmployee.first_name} ${row.reportingToEmployee.last_name}`;
          }
          return '-';
        },
      },
    ],
    []
  );

  return (
    <DataTable
      title="Employees"
      data={employees}
      columns={columns}
      onRowClick={onRowClick}
      loading={loading}
      searchable={true}
      filterable={true}
      exportable={true}
      printable={true}
      selectable={true}
      pagination={true}
      rowsPerPageOptions={[10, 25, 50, 100]}
      defaultRowsPerPage={10}
      getRowId={(row) => row.id}
    />
  );
};


