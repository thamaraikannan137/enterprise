import { Box, Typography } from '@mui/material';

interface EmptyStateViewProps {
  message: string;
}

export const EmptyStateView = ({ message }: EmptyStateViewProps) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        minHeight: 400,
      }}
    >
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};







