import { useState, useMemo } from 'react';
import { TextField, InputAdornment, Box, List, ListItem, ListItemButton, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { Search, MoreVert } from '@mui/icons-material';
import type { Location } from '../../../types/organization';

interface LocationListProps {
  locations: Location[];
  selectedLocationId?: string;
  onLocationSelect: (location: Location) => void;
  onEdit?: (location: Location) => void;
}

export const LocationList = ({
  locations,
  selectedLocationId,
  onLocationSelect,
  onEdit,
}: LocationListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedLocationForMenu, setSelectedLocationForMenu] = useState<Location | null>(null);

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) {
      return locations;
    }
    const query = searchQuery.toLowerCase();
    return locations.filter(
      (location) =>
        location.name.toLowerCase().includes(query) ||
        location.city.toLowerCase().includes(query) ||
        location.country.toLowerCase().includes(query) ||
        location.description?.toLowerCase().includes(query)
    );
  }, [locations, searchQuery]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, location: Location) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedLocationForMenu(location);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedLocationForMenu(null);
  };

  const handleEditClick = () => {
    if (selectedLocationForMenu && onEdit) {
      onEdit(selectedLocationForMenu);
    }
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        width: 350,
        height: '100%',
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography
          variant="overline"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'text.secondary',
            textTransform: 'uppercase',
          }}
        >
          Locations
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.default',
            },
          }}
        />
      </Box>

      {/* Location List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {filteredLocations.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'No locations found' : 'No locations'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredLocations.map((location) => (
              <ListItem 
                key={location.id} 
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => handleMenuOpen(e, location)}
                    sx={{ mr: 1 }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={location.id === selectedLocationId}
                  onClick={() => onLocationSelect(location)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '& .MuiTypography-root': {
                        color: 'primary.contrastText',
                      },
                    },
                  }}
                >
                  <Box sx={{ width: '100%', pr: 4 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      {location.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {location.city}, {location.state}, {location.country}
                    </Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
      </Menu>
    </Box>
  );
};

