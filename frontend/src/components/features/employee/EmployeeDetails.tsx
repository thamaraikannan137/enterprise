import { MuiCard } from '../../common';
import type { EmployeeWithDetails } from '../../../types/employee';

interface EmployeeDetailsProps {
  employee: EmployeeWithDetails;
}

export const EmployeeDetails = ({ employee }: EmployeeDetailsProps) => {
  const fullName = `${employee.first_name} ${employee.middle_name ? employee.middle_name + ' ' : ''}${employee.last_name}`;
  
  const getStatusColor = (status: EmployeeWithDetails['status']) => {
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
    <div className="space-y-6">
      <MuiCard className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
            <p className="text-gray-500 mt-1">Employee Code: {employee.employee_code}</p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(employee.status)}`}
          >
            {employee.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(employee.date_of_birth).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="text-sm text-gray-900 capitalize">{employee.gender}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Nationality</dt>
                <dd className="text-sm text-gray-900">{employee.nationality}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Marital Status</dt>
                <dd className="text-sm text-gray-900 capitalize">{employee.marital_status}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Hire Date</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(employee.hire_date).toLocaleDateString()}
                </dd>
              </div>
              {employee.termination_date && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Termination Date</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(employee.termination_date).toLocaleDateString()}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(employee.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(employee.updatedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </MuiCard>

      {/* Related Data Sections */}
      {employee.contacts && employee.contacts.length > 0 && (
        <MuiCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacts</h3>
          <p className="text-sm text-gray-500">{employee.contacts.length} contact(s)</p>
        </MuiCard>
      )}

      {employee.documents && employee.documents.length > 0 && (
        <MuiCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
          <p className="text-sm text-gray-500">{employee.documents.length} document(s)</p>
        </MuiCard>
      )}

      {employee.compensations && employee.compensations.length > 0 && (
        <MuiCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compensations</h3>
          <p className="text-sm text-gray-500">{employee.compensations.length} compensation(s)</p>
        </MuiCard>
      )}
    </div>
  );
};


