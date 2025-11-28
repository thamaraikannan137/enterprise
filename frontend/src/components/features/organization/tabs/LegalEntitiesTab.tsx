import { useState } from 'react';
import { Box } from '@mui/material';
import { MuiButton, MuiModal } from '../../../common';
import { LegalEntityList } from '../LegalEntityList';
import { LegalEntityDetailView } from '../LegalEntityDetailView';
import { LegalEntityForm } from '../LegalEntityForm';
import type { LegalEntity, CreateLegalEntityInput } from '../../../../types/organization';

export const LegalEntitiesTab = () => {
  const [legalEntities, setLegalEntities] = useState<LegalEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<LegalEntity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEntity, setEditingEntity] = useState<LegalEntity | null>(null);

  const handleAddClick = () => {
    setEditingEntity(null);
    setIsModalOpen(true);
  };

  const handleEntitySelect = (entity: LegalEntity) => {
    setSelectedEntity(entity);
  };

  const handleEditClick = () => {
    if (selectedEntity) {
      setEditingEntity(selectedEntity);
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
      // TODO: Replace with actual API call
      // For now, we'll just add to local state
      if (editingEntity) {
        // Update existing entity
        const updatedEntity: LegalEntity = {
          ...editingEntity,
          ...data,
          updated_at: new Date().toISOString(),
        };
        setLegalEntities(prev =>
          prev.map(entity =>
            entity.id === editingEntity.id ? updatedEntity : entity
          )
        );
        setSelectedEntity(updatedEntity);
      } else {
        // Create new entity
        const newEntity: LegalEntity = {
          ...data,
          id: `entity-${Date.now()}`,
          employee_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setLegalEntities(prev => [...prev, newEntity]);
        setSelectedEntity(newEntity);
      }
      setIsModalOpen(false);
      setEditingEntity(null);
    } catch (error) {
      console.error('Failed to save legal entity:', error);
      alert('Failed to save legal entity. Please try again.');
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
        <LegalEntityList
          legalEntities={legalEntities}
          selectedEntityId={selectedEntity?.id}
          onEntitySelect={handleEntitySelect}
        />

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
