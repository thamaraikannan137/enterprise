import { Tabs, Tab, Box } from '@mui/material';

interface EmployeeProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { value: 'about', label: 'About' },
  { value: 'job', label: 'Job' },
  { value: 'finances', label: 'Finances' },
  { value: 'docs', label: 'Docs' },
  { value: 'workpass', label: 'Work Pass' },
  { value: 'qualifications', label: 'Qualifications' },
];

export const EmployeeProfileTabs = ({
  activeTab,
  onTabChange,
}: EmployeeProfileTabsProps) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            minHeight: 48,
          },
          '& .Mui-selected': {
            color: '#1976d2',
            fontWeight: 600,
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#1976d2',
            height: 3,
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
    </Box>
  );
};

