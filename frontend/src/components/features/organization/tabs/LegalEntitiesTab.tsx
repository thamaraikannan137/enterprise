import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { MuiButton, MuiModal } from '../../../common';
import { LegalEntityList } from '../LegalEntityList';
import { LegalEntityDetailView } from '../LegalEntityDetailView';
import { LegalEntityForm } from '../LegalEntityForm';
import { legalEntityService } from '../../../../services/legalEntityService';
import { useToast } from '../../../../contexts/ToastContext';
import type { LegalEntity, CreateLegalEntityInput } from '../../../../types/organization';

export const LegalEntitiesTab = () => {
  const { showSuccess, showError } = useToast();
  const [legalEntities, setLegalEntities] = useState<LegalEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<LegalEntity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEntity, setEditingEntity] = useState<LegalEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch legal entities on component mount
  useEffect(() => {
    const fetchLegalEntities = async () => {
      setIsLoading(true);
      try {
        const entities = await legalEntityService.getLegalEntities();
        setLegalEntities(entities);
        // Select first entity if available
        if (entities.length > 0 && !selectedEntity) {
          setSelectedEntity(entities[0]);
        }
      } catch (err: any) {
        console.error('Failed to fetch legal entities:', err);
        showError(err.message || 'Failed to load legal entities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLegalEntities();
  }, [showError]);

  const handleAddClick = () => {
    setEditingEntity(null);
    setIsModalOpen(true);
  };

  const handleEntitySelect = (entity: LegalEntity) => {
    setSelectedEntity(entity);
  };

  const handleEditClick = (entity?: LegalEntity) => {
    const entityToEdit = entity || selectedEntity;
    if (entityToEdit) {
      setEditingEntity(entityToEdit);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setEditingEntity(null);
    }
  };

  const handleSave = async (data: CreateLegalEntityInput) => {
    setIsSubmitting(true);
    try {
      if (editingEntity && editingEntity.id) {
        // Update existing entity
        const updatedEntity = await legalEntityService.updateLegalEntity(
          editingEntity.id,
          data
        );
        setLegalEntities(prev =>
          prev.map(entity =>
            entity.id === editingEntity.id ? updatedEntity : entity
          )
        );
        setSelectedEntity(updatedEntity);
        showSuccess('Legal entity updated successfully');
      } else {
        // Create new entity
        const newEntity = await legalEntityService.createLegalEntity(data);
        setLegalEntities(prev => [...prev, newEntity]);
        setSelectedEntity(newEntity);
        showSuccess('Legal entity created successfully');
      }
      setIsModalOpen(false);
      setEditingEntity(null);
    } catch (err: any) {
      console.error('Failed to save legal entity:', err);
      const errorMessage = err.message || 'Failed to save legal entity. Please try again.';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entity: LegalEntity) => {
    if (!entity.id) {
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${entity.entity_name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await legalEntityService.deleteLegalEntity(entity.id);
      setLegalEntities(prev => prev.filter(e => e.id !== entity.id));
      
      // If the deleted entity was selected, clear selection or select another
      if (selectedEntity?.id === entity.id) {
        const remainingEntities = legalEntities.filter(e => e.id !== entity.id);
        setSelectedEntity(remainingEntities.length > 0 ? remainingEntities[0] : null);
      }
      showSuccess('Legal entity deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete legal entity:', err);
      const errorMessage = err.message || 'Failed to delete legal entity. Please try again.';
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Legal Entities</h2>
          <p className="text-gray-600 max-w-2xl">
            Manage legal entities within your organization. Legal entities are separate legal structures
            that can own assets, enter into contracts, and have legal obligations.
          </p>
        </Box>
        <MuiButton
          variant="contained"
          onClick={handleAddClick}
          sx={{ ml: 2 }}
        >
          +Add Legal Entity
        </MuiButton>
      </Box>

      {/* Split Panel Layout */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Entity List */}
        {isLoading ? (
          <Box sx={{ p: 3, width: '300px' }}>Loading legal entities...</Box>
        ) : (
          <LegalEntityList
            legalEntities={legalEntities}
            selectedEntityId={selectedEntity?.id}
            onEntitySelect={handleEntitySelect}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        )}

        {/* Right Panel - Detail View */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <LegalEntityDetailView entity={selectedEntity} />
        </Box>
      </Box>

      {/* Add/Edit Modal */}
      <MuiModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingEntity ? 'Edit Legal Entity' : 'Add Legal Entity'}
        onSave={() => {}}
        onCancel={handleCloseModal}
        isSubmitting={isSubmitting}
        maxWidth="lg"
        fullWidth
        showActions={false}
      >
        <LegalEntityForm
          onSubmit={handleSave}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
          initialData={editingEntity || undefined}
        />
      </MuiModal>
    </Box>
  );
};
