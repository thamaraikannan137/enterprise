import type { ReactNode } from 'react';
import { MuiCard, MuiModal } from '../../../../common';
import { Edit } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

interface EditableCardProps {
  title: string;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  children: ReactNode;
  editContent: ReactNode;
  modalMaxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const EditableCard = ({
  title,
  isEditMode,
  onEditModeChange,
  onSave,
  onCancel,
  isSubmitting = false,
  children,
  editContent,
  modalMaxWidth = 'md',
}: EditableCardProps) => {
  const handleSave = () => {
    // Find the form inside the modal and submit it
    // This triggers the form's onSubmit handler which will call handleSubmit(onSubmit)
    const modal = document.querySelector('[role="dialog"]');
    const form = modal?.querySelector('form');
    if (form) {
      form.requestSubmit();
    } else {
      // Fallback: call onSave directly if no form is found
      // This handles cases where onSave is a direct function call
      if (typeof onSave === 'function') {
        onSave();
      }
    }
  };

  const handleCancel = () => {
    onCancel();
    onEditModeChange(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      handleCancel();
    }
  };

  return (
    <>
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEditModeChange(true)}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
        {children}
      </MuiCard>

      <MuiModal
        open={isEditMode}
        onClose={handleClose}
        title={`Edit ${title}`}
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        maxWidth={modalMaxWidth}
        fullWidth
      >
        {editContent}
      </MuiModal>
    </>
  );
};

