import { useState } from 'react';
import { Box } from '@mui/material';
import { MuiButton, MuiModal } from '../../../common';
import { DepartmentList } from '../DepartmentList';
import { DepartmentDetailView } from '../DepartmentDetailView';
import { DepartmentForm } from '../DepartmentForm';
import type { Department, CreateDepartmentInput } from '../../../../types/organization';

export const DepartmentTab = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

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
      // TODO: Replace with actual API call
      // For now, we'll just add to local state
      if (editingDepartment) {
        // Update existing department
        const updatedDepartment: Department = {
          ...editingDepartment,
          ...data,
          updated_at: new Date().toISOString(),
        };
        setDepartments(prev =>
          prev.map(dept =>
            dept.id === editingDepartment.id ? updatedDepartment : dept
          )
        );
        setSelectedDepartment(updatedDepartment);
      } else {
        // Create new department
        const newDepartment: Department = {
          ...data,
          id: `department-${Date.now()}`,
          status: 'active',
          employee_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setDepartments(prev => [...prev, newDepartment]);
        setSelectedDepartment(newDepartment);
      }
      setIsModalOpen(false);
      setEditingDepartment(null);
    } catch (error) {
      console.error('Failed to save department:', error);
      alert('Failed to save department. Please try again.');
    } finally {
      setIsSubmitting(false);
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
        <DepartmentList
          departments={departments}
          selectedDepartmentId={selectedDepartment?.id}
          onDepartmentSelect={handleDepartmentSelect}
          onEdit={handleEditClick}
        />

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
