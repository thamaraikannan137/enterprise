import { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { MuiButton } from './MuiButton';

interface MuiModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  showActions?: boolean;
}

export const MuiModal = ({
  open,
  onClose,
  title,
  children,
  onSave,
  onCancel,
  isSubmitting = false,
  maxWidth = 'md',
  fullWidth = true,
  showActions = true,
}: MuiModalProps) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span className="text-xl font-semibold">{title}</span>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ pt: 2 }}>{children}</Box>
      </DialogContent>
      {showActions && (onSave || onCancel) && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          {onCancel && (
            <MuiButton
              variant="outlined"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </MuiButton>
          )}
          {onSave && (
            <MuiButton
              variant="contained"
              onClick={onSave}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Save
            </MuiButton>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

