import { useState } from 'react';
import { Box } from '@mui/material';
import { MuiButton, MuiModal } from '../../../common';
import { BusinessUnitList } from '../BusinessUnitList';
import { BusinessUnitDetailView } from '../BusinessUnitDetailView';
import { BusinessUnitForm } from '../BusinessUnitForm';
import type { BusinessUnit, CreateBusinessUnitInput } from '../../../../types/organization';

export const BusinessUnitTab = () => {
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUnit, setEditingUnit] = useState<BusinessUnit | null>(null);

  const handleAddClick = () => {
    setEditingUnit(null);
    setIsModalOpen(true);
  };

  const handleUnitSelect = (unit: BusinessUnit) => {
    setSelectedUnit(unit);
  };

  const handleEditClick = (unit?: BusinessUnit) => {
    const unitToEdit = unit || selectedUnit;
    if (unitToEdit) {
      setEditingUnit(unitToEdit);
      setIsModalOpen(true);
    }
  };


  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setEditingUnit(null);
    }
  };

  const handleSave = async (data: CreateBusinessUnitInput) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      // For now, we'll just add to local state
      if (editingUnit) {
        // Update existing unit
        const updatedUnit: BusinessUnit = {
          ...editingUnit,
          ...data,
          updated_at: new Date().toISOString(),
        };
        setBusinessUnits(prev =>
          prev.map(unit =>
            unit.id === editingUnit.id ? updatedUnit : unit
          )
        );
        setSelectedUnit(updatedUnit);
      } else {
        // Create new unit
        const newUnit: BusinessUnit = {
          ...data,
          id: `unit-${Date.now()}`,
          status: 'active',
          employee_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setBusinessUnits(prev => [...prev, newUnit]);
        setSelectedUnit(newUnit);
      }
      setIsModalOpen(false);
      setEditingUnit(null);
    } catch (error) {
      console.error('Failed to save business unit:', error);
      alert('Failed to save business unit. Please try again.');
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Unit</h2>
          <p className="text-gray-600 max-w-2xl">
            Business Units are the subsets or the functional units within your organization that operate
            independently and have their own strategic objectives.
          </p>
        </Box>
        <MuiButton
          variant="contained"
          onClick={handleAddClick}
          sx={{ ml: 2 }}
        >
          +Add Business Unit
        </MuiButton>
      </Box>

      {/* Split Panel Layout */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Unit List */}
        <BusinessUnitList
          businessUnits={businessUnits}
          selectedUnitId={selectedUnit?.id}
          onUnitSelect={handleUnitSelect}
          onEdit={handleEditClick}
        />

        {/* Right Panel - Detail View */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <BusinessUnitDetailView unit={selectedUnit} />
        </Box>
      </Box>

      {/* Add/Edit Modal */}
      <MuiModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingUnit ? 'Edit Business Unit' : 'Add Business Unit'}
        onSave={() => {}}
        onCancel={handleCloseModal}
        isSubmitting={isSubmitting}
        maxWidth="sm"
        fullWidth
        showActions={false}
      >
        <BusinessUnitForm
          onSubmit={handleSave}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
          initialData={editingUnit || undefined}
          isEdit={!!editingUnit}
        />
      </MuiModal>
    </Box>
  );
};
