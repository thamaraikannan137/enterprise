import { Box, Typography } from '@mui/material';

interface DetailSectionProps {
  label: string;
  value: string | number | undefined;
}

export const DetailSection = ({ label, value }: DetailSectionProps) => {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          mb: 0.5,
          display: 'block',
        }}
      >
        {label}
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: 'text.primary', 
          fontWeight: 400,
          wordBreak: 'break-word',
        }}
      >
        {value || 'N/A'}
      </Typography>
    </Box>
  );
};

