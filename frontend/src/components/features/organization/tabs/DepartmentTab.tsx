import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { MuiButton, MuiModal } from '../../../common';
import { DepartmentList } from '../DepartmentList';
import { DepartmentDetailView } from '../DepartmentDetailView';
import { DepartmentForm } from '../DepartmentForm';
import { departmentService } from '../../../../services/departmentService';
import { useToast } from '../../../../contexts/ToastContext';
import type { Department, CreateDepartmentInput } from '../../../../types/organization';

export const DepartmentTab = () => {
  const { showSuccess, showError } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const depts = await departmentService.getDepartments();
        setDepartments(depts);
        // Select first department if available
        if (depts.length > 0 && !selectedDepartment) {
          setSelectedDepartment(depts[0]);
        }
      } catch (err: any) {
        console.error('Failed to fetch departments:', err);
        showError(err.message || 'Failed to load departments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [showError]);

  const handleAddClick = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
  };

  const handleEditClick = (department?: Department) => {
    const departmentToEdit = department || selectedDepartment;
    if (departmentToEdit) {
      setEditingDepartment(departmentToEdit);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setEditingDepartment(null);
    }
  };

  const handleSave = async (data: CreateDepartmentInput) => {
    setIsSubmitting(true);
    try {
      if (editingDepartment && editingDepartment.id) {
        // Update existing department
        const updatedDepartment = await departmentService.updateDepartment(
          editingDepartment.id,
          data
        );
        setDepartments(prev =>
          prev.map(dept =>
            dept.id === editingDepartment.id ? updatedDepartment : dept
          )
        );
        setSelectedDepartment(updatedDepartment);
        showSuccess('Department updated successfully');
      } else {
        // Create new department
        const newDepartment = await departmentService.createDepartment(data);
        setDepartments(prev => [...prev, newDepartment]);
        setSelectedDepartment(newDepartment);
        showSuccess('Department created successfully');
      }
      setIsModalOpen(false);
      setEditingDepartment(null);
    } catch (err: any) {
      console.error('Failed to save department:', err);
      const errorMessage = err.message || 'Failed to save department. Please try again.';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (department: Department) => {
    if (!department.id) {
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${department.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await departmentService.deleteDepartment(department.id);
      setDepartments(prev => prev.filter(dept => dept.id !== department.id));
      
      // If the deleted department was selected, clear selection or select another
      if (selectedDepartment?.id === department.id) {
        const remainingDepartments = departments.filter(dept => dept.id !== department.id);
        setSelectedDepartment(remainingDepartments.length > 0 ? remainingDepartments[0] : null);
      }
      showSuccess('Department deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete department:', err);
      const errorMessage = err.message || 'Failed to delete department. Please try again.';
      showError(errorMessage);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'background.default' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexShrink: 0,
        }}
      >
        <Box>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Department</h2>
          <p className="text-gray-600 max-w-2xl">
            Manage departments within your organization. Departments are organizational units that
            group employees by function, expertise, or business area.
          </p>
        </Box>
        <MuiButton
          variant="contained"
          onClick={handleAddClick}
          sx={{ ml: 2 }}
        >
          +Add Department
        </MuiButton>
      </Box>

      {/* Split Panel Layout */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Department List */}
        {isLoading ? (
          <Box sx={{ p: 3, width: '300px' }}>Loading departments...</Box>
        ) : (
          <DepartmentList
            departments={departments}
            selectedDepartmentId={selectedDepartment?.id}
            onDepartmentSelect={handleDepartmentSelect}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        )}

        {/* Right Panel - Detail View */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <DepartmentDetailView department={selectedDepartment} />
        </Box>
      </Box>

      {/* Add/Edit Modal */}
      <MuiModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingDepartment ? 'Edit Department' : 'Add Department'}
        onSave={() => {}}
        onCancel={handleCloseModal}
        isSubmitting={isSubmitting}
        maxWidth="sm"
        fullWidth
        showActions={false}
      >
        <DepartmentForm
          onSubmit={handleSave}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
          initialData={editingDepartment || undefined}
          isEdit={!!editingDepartment}
        />
      </MuiModal>
    </Box>
  );
};
