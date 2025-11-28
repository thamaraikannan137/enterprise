import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchEmployeeWithDetails,
  clearError,
  clearCurrentEmployee,
} from '../store/slices/employeeSlice';
import { EmployeeProfileHeader } from '../components/features/employee/EmployeeProfileHeader';
import { EmployeeProfileTabs } from '../components/features/employee/EmployeeProfileTabs';
import { EmployeeProfileSidebar } from '../components/features/employee/EmployeeProfileSidebar';
import { MuiButton } from '../components/common';
import { AboutTab } from '../components/features/employee/tabs/AboutTab';
import { JobTab } from '../components/features/employee/tabs/JobTab';
import { FinancesTab } from '../components/features/employee/tabs/FinancesTab';
import { DocsTab } from '../components/features/employee/tabs/DocsTab';
import { WorkPassTab } from '../components/features/employee/tabs/WorkPassTab';
import type { EmployeeWithDetails } from '../types/employee';

export const EmployeeProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentEmployee, loading, error } = useAppSelector(
    (state) => state.employee
  );
  const [activeTab, setActiveTab] = useState<string>('about');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeWithDetails(id));
    }
    return () => {
      dispatch(clearError());
      dispatch(clearCurrentEmployee());
    };
  }, [dispatch, id]);

  if (loading && !currentEmployee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading employee profile...</div>
        </div>
      </div>
    );
  }

  if (error && !currentEmployee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <div className="text-center py-12">
          <MuiButton onClick={() => navigate('/employees')}>
            Back to Employees
          </MuiButton>
        </div>
      </div>
    );
  }

  if (!currentEmployee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Employee not found</p>
          <MuiButton onClick={() => navigate('/employees')}>
            Back to Employees
          </MuiButton>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <EmployeeProfileHeader
          employee={currentEmployee}
          isEditMode={isEditMode}
          onEditModeChange={setIsEditMode}
          onNavigateToEdit={() => navigate(`/employees/${id}/edit`)}
        />

        {/* Tabs Navigation */}
        <div className="bg-white border-b border-gray-200">
          <EmployeeProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Main Content */}
        <div className="bg-white mt-4">
          <div className="grid grid-cols-1  gap-6 p-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <EmployeeProfileTabsContent
                employee={currentEmployee}
                activeTab={activeTab}
                isEditMode={isEditMode}
                onEditModeChange={setIsEditMode}
              />
            </div>

            {/* Right Column - Sidebar */}
            {/* <div className="lg:col-span-1">
              <EmployeeProfileSidebar employee={currentEmployee} />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

interface EmployeeProfileTabsContentProps {
  employee: EmployeeWithDetails;
  activeTab: string;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

const EmployeeProfileTabsContent = ({
  employee,
  activeTab,
  isEditMode,
  onEditModeChange,
}: EmployeeProfileTabsContentProps) => {
  const commonProps = {
    employee,
    isEditMode,
    onEditModeChange,
  };

  switch (activeTab) {
    case 'about':
      return <AboutTab employee={employee} />;
    case 'job':
      return <JobTab {...commonProps} />;
    case 'finances':
      return <FinancesTab {...commonProps} />;
    case 'docs':
      return <DocsTab {...commonProps} />;
    case 'workpass':
      return <WorkPassTab {...commonProps} />;
    default:
      return <AboutTab employee={employee} />;
  }
};

