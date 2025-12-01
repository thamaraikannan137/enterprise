import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { getImageUrl } from '../../../utils/imageUtils';
import { employeeJobInfoService } from '../../../services/employeeJobInfoService';
import type { EmployeeWithDetails } from '../../../types/employee';
import type { EmployeeJobInfo } from '../../../types/employeeJobInfo';

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
  const [currentJobInfo, setCurrentJobInfo] = useState<EmployeeJobInfo | null>(null);
  const { id: employeeIdFromUrl } = useParams<{ id: string }>();
  
  const fullName = useMemo(
    () => `${employee.first_name} ${employee.middle_name ? employee.middle_name + ' ' : ''}${employee.last_name}`,
    [employee.first_name, employee.middle_name, employee.last_name]
  );
  
  // Memoize image URL to prevent recalculation on every render
  const imageUrl = useMemo(
    () => getImageUrl(employee.profile_photo_path),
    [employee.profile_photo_path]
  );

  // Fetch current job info
  useEffect(() => {
    const fetchJobInfo = async () => {
      // Try to get employee ID from employee object or URL params
      const employeeId = employee.id || (employee as any)._id || employeeIdFromUrl;
      
      if (!employeeId) {
        return;
      }

      try {
        const jobInfo = await employeeJobInfoService.getCurrentJobInfo(employeeId);
        if (jobInfo) {
          setCurrentJobInfo(jobInfo);
        }
      } catch (error: any) {
        // If 404, that's okay - no job info exists yet
        if (error?.response?.status !== 404) {
          console.error('EmployeeProfileHeader: Failed to fetch job info:', error);
        }
      }
    };
    
    fetchJobInfo();
  }, [employee.id, (employee as any)._id, employeeIdFromUrl]);

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

  // Get location from job info or employee address
  const getLocation = (): string => {
    // First try job info location
    if (currentJobInfo?.location) {
      return currentJobInfo.location;
    }
    // Then try to construct from employee address
    const addressParts = [
      employee.current_city_address || employee.current_city,
      employee.current_country
    ].filter(Boolean);
    if (addressParts.length > 0) {
      return addressParts.join(', ');
    }
    return '-';
  };

  // Get email from employee (contact info is now directly on employee)
  const getEmail = (): string => {
    if (employee.work_email) {
      return employee.work_email;
    }
    if (employee.personal_email) {
      return employee.personal_email;
    }
    return '-';
  };

  // Get phone from employee (contact info is now directly on employee)
  const getPhone = (): string => {
    if (employee.mobile_number) {
      return employee.mobile_number;
    }
    if (employee.work_number) {
      return employee.work_number;
    }
    return '-';
  };

  // Get reporting manager name
  const getReportingTo = (): string => {
    if (currentJobInfo?.reportingToEmployee) {
      const reportingTo = currentJobInfo.reportingToEmployee;
      return `${reportingTo.first_name} ${reportingTo.last_name}`;
    }
    // If reporting_to is an object, extract name
    if (currentJobInfo?.reporting_to && typeof currentJobInfo.reporting_to === 'object') {
      const reportingTo = currentJobInfo.reporting_to as any;
      if (reportingTo.first_name && reportingTo.last_name) {
        return `${reportingTo.first_name} ${reportingTo.last_name}`;
      }
    }
    return 'No Manager';
  };
  
  const contactInfo = useMemo(() => ({
    location: getLocation(),
    email: getEmail(),
    phone: getPhone(),
    designation: currentJobInfo?.designation || '-',
    department: currentJobInfo?.department || '-',
    reportingTo: getReportingTo(),
    employeeNo: employee.employee_code || '-',
    status: currentJobInfo?.status || 'active',
  }), [employee, currentJobInfo]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Photo and Basic Info */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Avatar
            src={imageUrl}
            alt={fullName}
            sx={{ width: 120, height: 120 }}
            className="border-4 border-blue-100"
            onError={(e) => {
              console.error('Failed to load profile image:', imageUrl);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          >
            {!imageUrl && fullName.charAt(0).toUpperCase()}
          </Avatar>
          
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
                label={contactInfo.status}
                color={getStatusColor(contactInfo.status)}
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

