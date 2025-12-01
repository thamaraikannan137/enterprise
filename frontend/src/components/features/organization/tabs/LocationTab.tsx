import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { MuiButton, MuiModal } from '../../../common';
import { LocationList } from '../LocationList';
import { LocationDetailView } from '../LocationDetailView';
import { LocationForm } from '../LocationForm';
import { locationService } from '../../../../services/locationService';
import { useToast } from '../../../../contexts/ToastContext';
import type { Location, CreateLocationInput } from '../../../../types/organization';

export const LocationTab = () => {
  const { showSuccess, showError } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const locs = await locationService.getLocations();
        setLocations(locs);
        // Select first location if available
        if (locs.length > 0 && !selectedLocation) {
          setSelectedLocation(locs[0]);
        }
      } catch (err: any) {
        console.error('Failed to fetch locations:', err);
        showError(err.message || 'Failed to load locations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [showError]);

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
      if (editingLocation && editingLocation.id) {
        // Update existing location
        const updatedLocation = await locationService.updateLocation(
          editingLocation.id,
          data
        );
        setLocations(prev =>
          prev.map(loc =>
            loc.id === editingLocation.id ? updatedLocation : loc
          )
        );
        setSelectedLocation(updatedLocation);
        showSuccess('Location updated successfully');
      } else {
        // Create new location
        const newLocation = await locationService.createLocation(data);
        setLocations(prev => [...prev, newLocation]);
        setSelectedLocation(newLocation);
        showSuccess('Location created successfully');
      }
      setIsModalOpen(false);
      setEditingLocation(null);
    } catch (err: any) {
      console.error('Failed to save location:', err);
      const errorMessage = err.message || 'Failed to save location. Please try again.';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (location: Location) => {
    if (!location.id) {
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${location.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await locationService.deleteLocation(location.id);
      setLocations(prev => prev.filter(loc => loc.id !== location.id));
      
      // If the deleted location was selected, clear selection or select another
      if (selectedLocation?.id === location.id) {
        const remainingLocations = locations.filter(loc => loc.id !== location.id);
        setSelectedLocation(remainingLocations.length > 0 ? remainingLocations[0] : null);
      }
      showSuccess('Location deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete location:', err);
      const errorMessage = err.message || 'Failed to delete location. Please try again.';
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
        {isLoading ? (
          <Box sx={{ p: 3, width: '300px' }}>Loading locations...</Box>
        ) : (
          <LocationList
            locations={locations}
            selectedLocationId={selectedLocation?.id}
            onLocationSelect={handleLocationSelect}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        )}

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
