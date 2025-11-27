import { useState, useRef, useEffect } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  value?: string; // Current file path/URL
  onChange?: (file: File | null, previewUrl?: string) => void;
  onUpload?: (file: File) => Promise<string>; // Upload function that returns file path
  autoUpload?: boolean; // If false, don't auto-upload on file select
  error?: string;
  disabled?: boolean;
}

export const FileUpload = ({
  label = 'Upload File',
  accept = 'image/*',
  maxSize = 5, // 5MB default
  value,
  onChange,
  onUpload,
  autoUpload = true, // Default to auto-upload
  error,
  disabled = false,
}: FileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview with value prop when it changes (e.g., when editing existing employee)
  useEffect(() => {
    if (value !== undefined) {
      setPreview(value || null);
    }
  }, [value]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (accept.includes('image/*') && !file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setPreview(previewUrl);
        onChange?.(file, previewUrl);
      };
      reader.readAsDataURL(file);
    } else {
      onChange?.(file);
    }

    // Auto-upload if onUpload function is provided and autoUpload is true
    if (onUpload && autoUpload) {
      setUploading(true);
      try {
        const filePath = await onUpload(file);
        setPreview(filePath);
        onChange?.(file, filePath);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload file. Please try again.');
        setPreview(value || null);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled || uploading}
      />

      {preview ? (
        <Box
          sx={{
            border: '1px solid',
            borderColor: error ? 'error.main' : 'divider',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {preview.startsWith('data:image') || preview.startsWith('http') ? (
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{
                maxWidth: '100%',
                maxHeight: 200,
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {preview}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClick}
              disabled={disabled || uploading}
              startIcon={<CloudUploadIcon />}
            >
              {uploading ? 'Uploading...' : 'Change'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleRemove}
              disabled={disabled || uploading}
              startIcon={<DeleteIcon />}
            >
              Remove
            </Button>
          </Box>

          {uploading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="caption" color="text.secondary">
                Uploading...
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Button
          variant="outlined"
          component="label"
          fullWidth
          disabled={disabled || uploading}
          startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
          sx={{
            py: 2,
            borderStyle: 'dashed',
            borderColor: error ? 'error.main' : 'divider',
            '&:hover': {
              borderColor: error ? 'error.main' : 'primary.main',
              backgroundColor: 'action.hover',
            },
          }}
        >
          {uploading ? 'Uploading...' : `Click to upload ${label.toLowerCase()}`}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            disabled={disabled || uploading}
          />
        </Button>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        Maximum file size: {maxSize}MB. Accepted formats: {accept}
      </Typography>
    </Box>
  );
};

