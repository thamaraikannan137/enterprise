import { useState, useMemo } from 'react';
import { TextField, InputAdornment, Box, List, ListItem, ListItemButton, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import type { LegalEntity } from '../../../types/organization';

interface LegalEntityListProps {
  legalEntities: LegalEntity[];
  selectedEntityId?: string;
  onEntitySelect: (entity: LegalEntity) => void;
}

export const LegalEntityList = ({
  legalEntities,
  selectedEntityId,
  onEntitySelect,
}: LegalEntityListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntities = useMemo(() => {
    if (!searchQuery.trim()) {
      return legalEntities;
    }
    const query = searchQuery.toLowerCase();
    return legalEntities.filter(
      (entity) =>
        entity.entity_name.toLowerCase().includes(query) ||
        entity.legal_name.toLowerCase().includes(query)
    );
  }, [legalEntities, searchQuery]);

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
          Legal Entities
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

      {/* Entity List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {filteredEntities.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'No entities found' : 'No legal entities'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredEntities.map((entity) => (
              <ListItem key={entity.id} disablePadding>
                <ListItemButton
                  selected={entity.id === selectedEntityId}
                  onClick={() => onEntitySelect(entity)}
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
                  <Box sx={{ width: '100%' }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      {entity.entity_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        '&.Mui-selected &': {
                          color: 'primary.contrastText',
                          opacity: 0.9,
                        },
                      }}
                    >
                      {entity.employee_count || 0} Employee
                      {(entity.employee_count || 0) !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

