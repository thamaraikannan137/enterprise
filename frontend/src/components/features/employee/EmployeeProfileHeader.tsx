import { useState } from 'react';
import {
  Box,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Chip,
} from '@mui/material';
import {
  LocationOn,
  Email,
  Phone,
  MoreVert,
  Edit,
  Delete,
  Print,
  Share,
} from '@mui/icons-material';
import type { EmployeeWithDetails } from '../../../types/employee';

type EmployeeWithJobInfo = EmployeeWithDetails & {
  designation?: string;
  department?: string;
};

interface EmployeeProfileHeaderProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
  onNavigateToEdit: () => void;
}

export const EmployeeProfileHeader = ({
  employee,
  isEditMode,
  onEditModeChange,
  onNavigateToEdit,
}: EmployeeProfileHeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const fullName = `${employee.first_name} ${employee.middle_name ? employee.middle_name + ' ' : ''}${employee.last_name}`;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEditModeChange(!isEditMode);
    handleMenuClose();
  };

  const handleDelete = () => {
    // Handle delete action
    handleMenuClose();
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
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

  // Get contact info from employee data or use defaults
  const employeeWithJob = employee as EmployeeWithJobInfo;
  
  const contactInfo = {
    location: 'Technovert | Hyderabad, India', // TODO: Get from contacts
    email: 'samanthad@technovert.com', // TODO: Get from contacts
    phone: '+91 9234125678', // TODO: Get from contacts
    designation: employeeWithJob.designation || 'N/A',
    department: employeeWithJob.department || 'N/A',
    reportingTo: employee.reportingToEmployee
      ? `${employee.reportingToEmployee.first_name} ${employee.reportingToEmployee.last_name}`
      : 'No Manager',
    employeeNo: employee.employee_code || 'N/A',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Photo and Basic Info */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Avatar
            src={employee.profile_photo_path}
            alt={fullName}
            sx={{ width: 120, height: 120 }}
            className="border-4 border-blue-100"
          />
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {fullName}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <LocationOn fontSize="small" className="text-gray-400" />
                    <span>{contactInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Email fontSize="small" className="text-gray-400" />
                    <span>{contactInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone fontSize="small" className="text-gray-400" />
                    <span>{contactInfo.phone}</span>
                  </div>
                </div>
              </div>
              
              {/* Actions Button */}
              <Box>
                <IconButton
                  onClick={handleMenuOpen}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="small"
                >
                  <MoreVert />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleEdit}>
                    <Edit fontSize="small" className="mr-2" />
                    {isEditMode ? 'Exit Edit Mode' : 'Edit'}
                  </MenuItem>
                  <MenuItem onClick={onNavigateToEdit}>
                    <Edit fontSize="small" className="mr-2" />
                    Full Edit
                  </MenuItem>
                  <MenuItem onClick={handleDelete}>
                    <Delete fontSize="small" className="mr-2" />
                    Delete
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Print fontSize="small" className="mr-2" />
                    Print
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Share fontSize="small" className="mr-2" />
                    Share
                  </MenuItem>
                </Menu>
              </Box>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Designation
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {contactInfo.designation}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Department
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {contactInfo.department}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Reporting To
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {contactInfo.reportingTo}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Employee No
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {contactInfo.employeeNo}
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-3">
              <Chip
                label={employee.status}
                color={getStatusColor(employee.status)}
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

