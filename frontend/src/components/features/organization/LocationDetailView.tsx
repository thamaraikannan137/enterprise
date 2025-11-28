import { Box, Typography, Grid, Paper } from '@mui/material';
import type { Location } from '../../../types/organization';
import { DetailSection } from './shared/DetailSection';
import { EmptyStateView } from './shared/EmptyStateView';

export const LocationDetailView = ({ location }: { location: Location | null }) => {
  if (!location) {
    return <EmptyStateView message="Select a location to view details" />;
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
              <DetailSection label="Name" value={location.name} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailSection label="Timezone" value={location.timezone} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailSection label="Country" value={location.country} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailSection label="State" value={location.state} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailSection label="City" value={location.city} />
            </Grid>
            <Grid item xs={12}>
              <DetailSection label="Address" value={location.address} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailSection label="Zip Code" value={location.zip_code} />
            </Grid>
            {location.description && (
              <Grid item xs={12}>
                <DetailSection label="Description" value={location.description} />
              </Grid>
            )}
            {location.status && (
              <Grid item xs={12} sm={6}>
                <DetailSection label="Status" value={location.status} />
              </Grid>
            )}
            {location.employee_count !== undefined && (
              <Grid item xs={12} sm={6}>
                <DetailSection 
                  label="Employee Count" 
                  value={`${location.employee_count} Employee${location.employee_count !== 1 ? 's' : ''}`} 
                />
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};
