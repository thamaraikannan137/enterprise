import { useState } from 'react';
import { Box } from '@mui/material';
import { MuiButton, MuiModal } from '../../../common';
import { LocationList } from '../LocationList';
import { LocationDetailView } from '../LocationDetailView';
import { LocationForm } from '../LocationForm';
import type { Location, CreateLocationInput } from '../../../../types/organization';

export const LocationTab = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const handleAddClick = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleEditClick = (location?: Location) => {
    const locationToEdit = location || selectedLocation;
    if (locationToEdit) {
      setEditingLocation(locationToEdit);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setEditingLocation(null);
    }
  };

  const handleSave = async (data: CreateLocationInput) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      // For now, we'll just add to local state
      if (editingLocation) {
        // Update existing location
        const updatedLocation: Location = {
          ...editingLocation,
          ...data,
          updated_at: new Date().toISOString(),
        };
        setLocations(prev =>
          prev.map(loc =>
            loc.id === editingLocation.id ? updatedLocation : loc
          )
        );
        setSelectedLocation(updatedLocation);
      } else {
        // Create new location
        const newLocation: Location = {
          ...data,
          id: `location-${Date.now()}`,
          status: 'active',
          employee_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setLocations(prev => [...prev, newLocation]);
        setSelectedLocation(newLocation);
      }
      setIsModalOpen(false);
      setEditingLocation(null);
    } catch (error) {
      console.error('Failed to save location:', error);
      alert('Failed to save location. Please try again.');
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Location</h2>
          <p className="text-gray-600 max-w-2xl">
            Manage physical locations and offices within your organization. Locations represent
            geographical places where your organization operates.
          </p>
        </Box>
        <MuiButton
          variant="contained"
          onClick={handleAddClick}
          sx={{ ml: 2 }}
        >
          +Add Location
        </MuiButton>
      </Box>

      {/* Split Panel Layout */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Location List */}
        <LocationList
          locations={locations}
          selectedLocationId={selectedLocation?.id}
          onLocationSelect={handleLocationSelect}
          onEdit={handleEditClick}
        />

        {/* Right Panel - Detail View */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <LocationDetailView location={selectedLocation} />
        </Box>
      </Box>

      {/* Add/Edit Modal */}
      <MuiModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingLocation ? 'Edit Location' : 'Add Location'}
        onSave={() => {}}
        onCancel={handleCloseModal}
        isSubmitting={isSubmitting}
        maxWidth="sm"
        fullWidth
        showActions={false}
      >
        <LocationForm
          onSubmit={handleSave}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
          initialData={editingLocation || undefined}
          isEdit={!!editingLocation}
        />
      </MuiModal>
    </Box>
  );
};
