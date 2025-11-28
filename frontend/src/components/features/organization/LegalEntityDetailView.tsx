import { useState } from 'react';
import { Box, Tabs, Tab, Typography, Grid, Paper } from '@mui/material';
import type { LegalEntity } from '../../../types/organization';
import { DetailSection } from './shared/DetailSection';
import { EmptyStateView } from './shared/EmptyStateView';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ height: '100%', overflow: 'auto' }}>
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  );
};

export const LegalEntityDetailView = ({ entity }: { entity: LegalEntity | null }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!entity) {
    return <EmptyStateView message="Select a legal entity to view details" />;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

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
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minHeight: 48,
              fontSize: { xs: '0.875rem', sm: '1rem' },
            },
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="General info" />
          <Tab label="Payroll" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <TabPanel value={activeTab} index={0}>
          {/* Single Card with 3 Sections */}
          <Paper 
            sx={{ 
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
            }}
          >
            {/* Entity Details Section */}
            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: 'text.primary',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Entity Details
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  mb: 3,
                  display: 'block',
                }}
              >
                Entity basic details field group
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} sm={6}>
                  <DetailSection label="Entity Name" value={entity.entity_name} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailSection label="Legal Name" value={entity.legal_name} />
                </Grid>
                {entity.other_business_name && (
                  <Grid item xs={12} sm={6}>
                    <DetailSection label="Other Business Name" value={entity.other_business_name} />
                  </Grid>
                )}
                {(entity.federal_employer_id || entity.company_identification_number) && (
                  <Grid item xs={12} sm={6}>
                    <DetailSection
                      label="Federal Employer ID"
                      value={entity.federal_employer_id || entity.company_identification_number}
                    />
                  </Grid>
                )}
                {entity.state_registration_number && (
                  <Grid item xs={12} sm={6}>
                    <DetailSection label="State Registration Number" value={entity.state_registration_number} />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <DetailSection
                    label="Date of Incorporation"
                    value={formatDate(entity.date_of_incorporation)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailSection label="Business Type" value={entity.business_type} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailSection label="Industry Type" value={entity.industry_type} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailSection label="Currency" value={entity.currency} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailSection label="Financial Year" value={entity.financial_year} />
                </Grid>
              </Grid>
            </Box>

            {/* Divider */}
            <Box sx={{ borderTop: 1, borderColor: 'divider', my: { xs: 3, sm: 4 } }} />

            {/* Contact Details Section */}
            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: 'text.primary',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Contact Details
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {entity.website && (
                  <Grid item xs={12} sm={6}>
                    <DetailSection label="Website" value={entity.website} />
                  </Grid>
                )}
                {entity.email && (
                  <Grid item xs={12} sm={6}>
                    <DetailSection label="Email" value={entity.email} />
                  </Grid>
                )}
                {entity.phone && (
                  <Grid item xs={12} sm={6}>
                    <DetailSection label="Phone" value={entity.phone} />
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Divider */}
            <Box sx={{ borderTop: 1, borderColor: 'divider', my: { xs: 3, sm: 4 } }} />

            {/* Registered Address Section */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: 'text.primary',
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Registered Address
              </Typography>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} sm={6}>
                  <DetailSection label="Street 1" value={entity.street_1} />
                </Grid>
                {entity.street_2 && (
                  <Grid item xs={12} sm={6}>
                    <DetailSection label="Street 2" value={entity.street_2} />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <DetailSection label="City" value={entity.city} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailSection label="State" value={entity.state} />
                </Grid>
                {entity.zip_code && (
                  <Grid item xs={12} sm={6}>
                    <DetailSection label="Zip Code" value={entity.zip_code} />
                  </Grid>
                )}
                {entity.country && (
                  <Grid item xs={12} sm={6}>
                    <DetailSection label="Country" value={entity.country} />
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Paper 
            sx={{ 
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 2,
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Payroll
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Payroll configuration will be implemented here
            </Typography>
          </Paper>
        </TabPanel>
      </Box>
    </Box>
  );
};
