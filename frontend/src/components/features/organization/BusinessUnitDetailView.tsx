import { Box, Typography, Grid, Paper } from '@mui/material';
import type { BusinessUnit } from '../../../types/organization';
import { DetailSection } from './shared/DetailSection';
import { EmptyStateView } from './shared/EmptyStateView';

export const BusinessUnitDetailView = ({ unit }: { unit: BusinessUnit | null }) => {
  if (!unit) {
    return <EmptyStateView message="Select a business unit to view details" />;
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: { xs: 2, sm: 3 },
        }}
      >
        <Paper 
          sx={{ 
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <DetailSection label="Name" value={unit.name} />
            </Grid>
            {unit.description && (
              <Grid item xs={12}>
                <DetailSection label="Description" value={unit.description} />
              </Grid>
            )}
            {unit.status && (
              <Grid item xs={12} sm={6}>
                <DetailSection label="Status" value={unit.status} />
              </Grid>
            )}
            {unit.employee_count !== undefined && (
              <Grid item xs={12} sm={6}>
                <DetailSection 
                  label="Employee Count" 
                  value={`${unit.employee_count} Employee${unit.employee_count !== 1 ? 's' : ''}`} 
                />
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};
