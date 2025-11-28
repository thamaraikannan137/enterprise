import { Box, Typography, Grid, Paper } from '@mui/material';
import type { Department } from '../../../types/organization';
import { DetailSection } from './shared/DetailSection';
import { EmptyStateView } from './shared/EmptyStateView';

export const DepartmentDetailView = ({ department }: { department: Department | null }) => {
  if (!department) {
    return <EmptyStateView message="Select a department to view details" />;
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
              <DetailSection label="Name" value={department.name} />
            </Grid>
            {department.description && (
              <Grid item xs={12}>
                <DetailSection label="Description" value={department.description} />
              </Grid>
            )}
            {department.status && (
              <Grid item xs={12} sm={6}>
                <DetailSection label="Status" value={department.status} />
              </Grid>
            )}
            {department.employee_count !== undefined && (
              <Grid item xs={12} sm={6}>
                <DetailSection 
                  label="Employee Count" 
                  value={`${department.employee_count} Employee${department.employee_count !== 1 ? 's' : ''}`} 
                />
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

