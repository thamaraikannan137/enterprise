import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import { z } from 'zod';
import { MuiCard, MuiButton } from '../../../common';
import { Edit, Add, Delete, Save, Cancel } from '@mui/icons-material';
import { TextField, Grid, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import { employeeRelatedService } from '../../../../services/employeeRelatedService';
import { useToast } from '../../../../contexts/ToastContext';
import type { EmployeeWithDetails } from '../../../../types/employee';
import type { EmployeeContact, CreateEmployeeContactInput } from '../../../../types/employeeRelated';

interface ContactTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

const contactSchema = z.object({
  contact_type: z.enum(['primary', 'secondary', 'emergency']),
  phone: z.string().optional(),
  alternate_phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  is_current: z.boolean().optional(),
  valid_from: z.string().min(1, 'Valid from date is required'),
  valid_to: z.string().optional().or(z.literal('')),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: ContactTabProps) => {
  const { id: employeeIdFromUrl } = useParams<{ id: string }>();
  const { showSuccess, showError } = useToast();
  const employeeId = useMemo(() => employee?.id || employeeIdFromUrl, [employee?.id, employeeIdFromUrl]);
  const [contacts, setContacts] = useState<EmployeeContact[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: {
      contact_type: 'primary',
      phone: '',
      alternate_phone: '',
      email: '',
      address_line1: '',
      address_line2: '',
      city: '',
      postal_code: '',
      country: '',
      is_current: true,
      valid_from: new Date().toISOString().split('T')[0],
      valid_to: '',
    },
  });

  const loadContacts = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const data = await employeeRelatedService.getEmployeeContacts(employeeId);
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId) {
      loadContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  const onSubmit = async (data: ContactFormData) => {
    if (!employeeId) {
      showError('Error: Employee ID is missing. Please refresh the page and try again.');
      return;
    }
    try {
      const payload: CreateEmployeeContactInput = {
        employee_id: employeeId,
        contact_type: data.contact_type,
        phone: data.phone || undefined,
        alternate_phone: data.alternate_phone || undefined,
        email: data.email || undefined,
        address_line1: data.address_line1 || undefined,
        address_line2: data.address_line2 || undefined,
        city: data.city || undefined,
        postal_code: data.postal_code || undefined,
        country: data.country || undefined,
        is_current: data.is_current ?? true,
        valid_from: data.valid_from,
        valid_to: data.valid_to || undefined,
      };
      await employeeRelatedService.createContact(payload);
      await loadContacts();
      showSuccess('Contact added successfully!');
      reset({
        contact_type: 'secondary',
        phone: '',
        alternate_phone: '',
        email: '',
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: '',
        is_current: false,
        valid_from: new Date().toISOString().split('T')[0],
        valid_to: '',
      });
    } catch (error: any) {
      console.error('Failed to create contact:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to create contact. Please try again.';
      showError(errorMessage);
    }
  };

  const handleDelete = async (_id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      // TODO: Implement delete API call
      await loadContacts();
    }
  };

  const getContactTypeColor = (type: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
      primary: 'primary',
      secondary: 'info',
      emergency: 'error',
    };
    return colors[type] || 'default';
  };

  return (
    <div className="space-y-6">
      {import.meta.env.DEV && <DevTool control={control} />}
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          {!isEditMode && (
            <MuiButton
              size="small"
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => onEditModeChange(true)}
            >
              Edit
            </MuiButton>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading contacts...</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No contact information available.
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <Chip
                    label={contact.contact_type}
                    color={getContactTypeColor(contact.contact_type)}
                    size="small"
                  />
                  {contact.is_current && (
                    <Chip label="Current" color="success" size="small" />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {contact.phone && (
                    <div>
                      <span className="text-gray-500">Phone: </span>
                      <span className="text-gray-900">{contact.phone}</span>
                    </div>
                  )}
                  {contact.alternate_phone && (
                    <div>
                      <span className="text-gray-500">Alternate Phone: </span>
                      <span className="text-gray-900">{contact.alternate_phone}</span>
                    </div>
                  )}
                  {contact.email && (
                    <div>
                      <span className="text-gray-500">Email: </span>
                      <span className="text-gray-900">{contact.email}</span>
                    </div>
                  )}
                  {contact.address_line1 && (
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Address: </span>
                      <span className="text-gray-900">
                        {contact.address_line1}
                        {contact.address_line2 && `, ${contact.address_line2}`}
                        {contact.city && `, ${contact.city}`}
                        {contact.postal_code && ` ${contact.postal_code}`}
                        {contact.country && `, ${contact.country}`}
                      </span>
                    </div>
                  )}
                  {contact.valid_from && (
                    <div>
                      <span className="text-gray-500">Valid From: </span>
                      <span className="text-gray-900">
                        {new Date(contact.valid_from).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {contact.valid_to && (
                    <div>
                      <span className="text-gray-500">Valid To: </span>
                      <span className="text-gray-900">
                        {new Date(contact.valid_to).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                {isEditMode && (
                  <div className="mt-3">
                    <MuiButton
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(contact.id)}
                    >
                      Delete
                    </MuiButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isEditMode && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Add New Contact</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="contact_type"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth error={!!fieldState.error}>
                        <InputLabel>Contact Type</InputLabel>
                        <Select
                          {...field}
                          label="Contact Type"
                        >
                          <MenuItem value="primary">Primary</MenuItem>
                          <MenuItem value="secondary">Secondary</MenuItem>
                          <MenuItem value="emergency">Emergency</MenuItem>
                        </Select>
                        {fieldState.error && (
                          <span className="text-xs text-red-500 mt-1">{fieldState.error.message}</span>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="alternate_phone"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Alternate Phone"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        type="email"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="address_line1"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Address Line 1"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="address_line2"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Address Line 2"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="City"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="postal_code"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Postal Code"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Country"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="valid_from"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Valid From"
                        type="date"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="valid_to"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Valid To (optional)"
                        type="date"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || undefined)}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="is_current"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.value || false}
                          onChange={field.onChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">This is the current address</span>
                      </label>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="flex gap-2">
                    <MuiButton
                      type="submit"
                      variant="contained"
                      startIcon={<Add />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Adding...' : 'Add Contact'}
                    </MuiButton>
                    <MuiButton
                      type="button"
                      variant="outlined"
                      startIcon={<Save />}
                      onClick={() => onEditModeChange(false)}
                      disabled={isSubmitting}
                    >
                      Done
                    </MuiButton>
                    <MuiButton
                      type="button"
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => {
                        reset();
                        onEditModeChange(false);
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </MuiButton>
                  </div>
                </Grid>
              </Grid>
            </form>
          </div>
        )}
      </MuiCard>
    </div>
  );
};
