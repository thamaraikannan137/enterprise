import { useState, useMemo } from 'react';
import { TextField, InputAdornment, Box, List, ListItem, ListItemButton, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { Search, MoreVert } from '@mui/icons-material';
import type { BusinessUnit } from '../../../types/organization';

interface BusinessUnitListProps {
  businessUnits: BusinessUnit[];
  selectedUnitId?: string;
  onUnitSelect: (unit: BusinessUnit) => void;
  onEdit?: (unit: BusinessUnit) => void;
  onDelete?: (unit: BusinessUnit) => void;
}

export const BusinessUnitList = ({
  businessUnits,
  selectedUnitId,
  onUnitSelect,
  onEdit,
  onDelete,
}: BusinessUnitListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUnitForMenu, setSelectedUnitForMenu] = useState<BusinessUnit | null>(null);

  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) {
      return businessUnits;
    }
    const query = searchQuery.toLowerCase();
    return businessUnits.filter(
      (unit) =>
        unit.name.toLowerCase().includes(query) ||
        unit.description?.toLowerCase().includes(query)
    );
  }, [businessUnits, searchQuery]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, unit: BusinessUnit) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedUnitForMenu(unit);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedUnitForMenu(null);
  };

  const handleEditClick = () => {
    if (selectedUnitForMenu && onEdit) {
      onEdit(selectedUnitForMenu);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (selectedUnitForMenu && onDelete) {
      onDelete(selectedUnitForMenu);
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
          Business Units
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

      {/* Unit List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {filteredUnits.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'No business units found' : 'No business units'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredUnits.map((unit) => (
              <ListItem 
                key={unit.id} 
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => handleMenuOpen(e, unit)}
                    sx={{ mr: 1 }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={unit.id === selectedUnitId}
                  onClick={() => onUnitSelect(unit)}
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
                      {unit.name}
                    </Typography>
                    {unit.description && (
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
                        {unit.description}
                      </Typography>
                    )}
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
        {onDelete && (
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            Delete
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};
