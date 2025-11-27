import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchEmployeeWithDetails,
  deleteEmployee,
  clearError,
  clearCurrentEmployee,
} from '../store/slices/employeeSlice';
import { EmployeeDetails } from '../components/features/employee';
import { MuiButton } from '../components/common';
import type { EmployeeWithDetails } from '../types/employee';

export const EmployeeDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentEmployee, loading, error } = useAppSelector(
    (state) => state.employee
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeWithDetails(id));
    }
    return () => {
      dispatch(clearError());
      dispatch(clearCurrentEmployee());
    };
  }, [dispatch, id]);

  const handleEdit = () => {
    if (id) {
      navigate(`/employees/${id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await dispatch(deleteEmployee(id)).unwrap();
        navigate('/employees');
      } catch (error) {
        console.error('Failed to delete employee:', error);
      }
    }
  };

  if (loading && !currentEmployee) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading employee details...</div>
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <MuiButton variant="outlined" onClick={() => navigate('/employees')}>
          ← Back to Employees
        </MuiButton>
        <div className="flex gap-2">
          <MuiButton variant="outlined" onClick={handleEdit}>
            Edit
          </MuiButton>
          <MuiButton variant="outlined" color="error" onClick={handleDelete}>
            Delete
          </MuiButton>
        </div>
      </div>

      <EmployeeDetails employee={currentEmployee as EmployeeWithDetails} />
    </div>
  );
};


