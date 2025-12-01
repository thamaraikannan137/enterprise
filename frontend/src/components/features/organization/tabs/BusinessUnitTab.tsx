import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { MuiButton, MuiModal } from '../../../common';
import { BusinessUnitList } from '../BusinessUnitList';
import { BusinessUnitDetailView } from '../BusinessUnitDetailView';
import { BusinessUnitForm } from '../BusinessUnitForm';
import { businessUnitService } from '../../../../services/businessUnitService';
import { useToast } from '../../../../contexts/ToastContext';
import type { BusinessUnit, CreateBusinessUnitInput } from '../../../../types/organization';

export const BusinessUnitTab = () => {
  const { showSuccess, showError } = useToast();
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUnit, setEditingUnit] = useState<BusinessUnit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch business units on component mount
  useEffect(() => {
    const fetchBusinessUnits = async () => {
      setIsLoading(true);
      try {
        const units = await businessUnitService.getBusinessUnits();
        setBusinessUnits(units);
        // Select first unit if available
        if (units.length > 0 && !selectedUnit) {
          setSelectedUnit(units[0]);
        }
      } catch (err: any) {
        console.error('Failed to fetch business units:', err);
        showError(err.message || 'Failed to load business units');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessUnits();
  }, [showError]);

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
      if (editingUnit && editingUnit.id) {
        // Update existing unit
        const updatedUnit = await businessUnitService.updateBusinessUnit(
          editingUnit.id,
          data
        );
        setBusinessUnits(prev =>
          prev.map(unit =>
            unit.id === editingUnit.id ? updatedUnit : unit
          )
        );
        setSelectedUnit(updatedUnit);
        showSuccess('Business unit updated successfully');
      } else {
        // Create new unit
        const newUnit = await businessUnitService.createBusinessUnit(data);
        setBusinessUnits(prev => [...prev, newUnit]);
        setSelectedUnit(newUnit);
        showSuccess('Business unit created successfully');
      }
      setIsModalOpen(false);
      setEditingUnit(null);
    } catch (err: any) {
      console.error('Failed to save business unit:', err);
      const errorMessage = err.message || 'Failed to save business unit. Please try again.';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (unit: BusinessUnit) => {
    if (!unit.id) {
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${unit.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await businessUnitService.deleteBusinessUnit(unit.id);
      setBusinessUnits(prev => prev.filter(bu => bu.id !== unit.id));
      
      // If the deleted unit was selected, clear selection or select another
      if (selectedUnit?.id === unit.id) {
        const remainingUnits = businessUnits.filter(bu => bu.id !== unit.id);
        setSelectedUnit(remainingUnits.length > 0 ? remainingUnits[0] : null);
      }
      showSuccess('Business unit deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete business unit:', err);
      const errorMessage = err.message || 'Failed to delete business unit. Please try again.';
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
        {isLoading ? (
          <Box sx={{ p: 3, width: '300px' }}>Loading business units...</Box>
        ) : (
          <BusinessUnitList
            businessUnits={businessUnits}
            selectedUnitId={selectedUnit?.id}
            onUnitSelect={handleUnitSelect}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        )}

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
