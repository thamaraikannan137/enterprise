import { useState, useMemo } from 'react';
import { TextField, InputAdornment, Box, List, ListItem, ListItemButton, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { Search, MoreVert } from '@mui/icons-material';
import type { Department } from '../../../types/organization';

interface DepartmentListProps {
  departments: Department[];
  selectedDepartmentId?: string;
  onDepartmentSelect: (department: Department) => void;
  onEdit?: (department: Department) => void;
  onDelete?: (department: Department) => void;
}

export const DepartmentList = ({
  departments,
  selectedDepartmentId,
  onDepartmentSelect,
  onEdit,
  onDelete,
}: DepartmentListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedDepartmentForMenu, setSelectedDepartmentForMenu] = useState<Department | null>(null);

  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) {
      return departments;
    }
    const query = searchQuery.toLowerCase();
    return departments.filter(
      (department) =>
        department.name.toLowerCase().includes(query) ||
        department.description?.toLowerCase().includes(query)
    );
  }, [departments, searchQuery]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, department: Department) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedDepartmentForMenu(department);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedDepartmentForMenu(null);
  };

  const handleEditClick = () => {
    if (selectedDepartmentForMenu && onEdit) {
      onEdit(selectedDepartmentForMenu);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (selectedDepartmentForMenu && onDelete) {
      onDelete(selectedDepartmentForMenu);
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
          Departments
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

      {/* Department List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {filteredDepartments.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'No departments found' : 'No departments'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredDepartments.map((department) => (
              <ListItem 
                key={department.id} 
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => handleMenuOpen(e, department)}
                    sx={{ mr: 1 }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={department.id === selectedDepartmentId}
                  onClick={() => onDepartmentSelect(department)}
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
                      {department.name}
                    </Typography>
                    {department.description && (
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
                        {department.description}
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


