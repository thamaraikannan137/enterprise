import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DevTool } from '@hookform/devtools';
import { z } from 'zod';
import { MuiCard, MuiButton } from '../../../common';
import { Edit, Save, Cancel, Add, Delete } from '@mui/icons-material';
import { TextField, Paper, Chip } from '@mui/material';
import { employeeRelatedService } from '../../../../services/employeeRelatedService';
import { useToast } from '../../../../contexts/ToastContext';
import type { EmployeeWithDetails } from '../../../../types/employee';
import type { EmployeeCompensation, CreateEmployeeCompensationInput, UpdateEmployeeCompensationInput } from '../../../../types/employeeRelated';

interface FinancesTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

// Schema for compensation (used for both editing and adding)
const compensationSchema = z.object({
  basic_salary: z.coerce.number().min(0, 'Basic salary must be positive'),
  ot_hourly_rate: z.coerce.number().min(0, 'OT rate must be positive').optional().nullable(),
  effective_from: z.string().min(1, 'Effective from date is required'),
  effective_to: z.string().optional().nullable(),
  is_current: z.boolean(),
});

type CompensationFormData = z.infer<typeof compensationSchema>;

export const FinancesTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: FinancesTabProps) => {
  const { id: employeeIdFromUrl } = useParams<{ id: string }>();
  const { showSuccess, showError } = useToast();
  const employeeId = useMemo(() => employee?.id || employeeIdFromUrl, [employee?.id, employeeIdFromUrl]);
  const [compensations, setCompensations] = useState<EmployeeCompensation[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form for editing existing compensation
  const editForm = useForm<CompensationFormData>({
    resolver: zodResolver(compensationSchema),
    mode: 'onChange',
  });

  // Form for adding new compensation
  const newForm = useForm<CompensationFormData>({
    resolver: zodResolver(compensationSchema),
    mode: 'onChange',
    defaultValues: {
      basic_salary: 0,
      ot_hourly_rate: undefined,
      effective_from: new Date().toISOString().split('T')[0],
      effective_to: undefined,
      is_current: true,
    },
  });

  const loadCompensations = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const data = await employeeRelatedService.getEmployeeCompensations(employeeId);
      setCompensations(data);
    } catch (error) {
      console.error('Failed to load compensations:', error);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId) {
      loadCompensations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);

  useEffect(() => {
    if (!isEditMode) {
      setEditingIndex(null);
      setShowAddForm(false);
    }
  }, [isEditMode]);

  const handleAdd = async (data: CompensationFormData) => {
    if (!employeeId) {
      showError('Error: Employee ID is missing. Please refresh the page and try again.');
      return;
    }
    try {
      const payload: CreateEmployeeCompensationInput = {
        employee_id: employeeId,
        basic_salary: data.basic_salary,
        ot_hourly_rate: data.ot_hourly_rate || undefined,
        effective_from: data.effective_from,
        effective_to: data.effective_to || undefined,
        is_current: data.is_current,
      };
      await employeeRelatedService.createCompensation(payload);
      await loadCompensations();
      showSuccess('Compensation added successfully!');
      newForm.reset({
        basic_salary: 0,
        ot_hourly_rate: undefined,
        effective_from: new Date().toISOString().split('T')[0],
        effective_to: undefined,
        is_current: true,
      });
      setShowAddForm(false);
    } catch (error: any) {
      console.error('Failed to create compensation:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to create compensation. Please try again.';
      showError(errorMessage);
    }
  };

  const handleEdit = (index: number) => {
    const compensation = compensations[index];
    setEditingIndex(index);
    editForm.reset({
      basic_salary: compensation.basic_salary,
      ot_hourly_rate: compensation.ot_hourly_rate || undefined,
      effective_from: compensation.effective_from.split('T')[0],
      effective_to: compensation.effective_to ? compensation.effective_to.split('T')[0] : undefined,
      is_current: compensation.is_current,
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    editForm.reset();
  };

  const handleSave = async (index: number) => {
    console.log('handleSave', index);
    const compensation = compensations[index];
    if (!compensation?.id) {
      showError('Error: Compensation ID is missing. This record cannot be updated.');
      return;
    }

    const isValid = await editForm.trigger();
    if (!isValid) {
      showError('Please fix the validation errors before saving.');
      return;
    }

    const formData = editForm.getValues();
    setSaving(true);
    try {
      const payload: UpdateEmployeeCompensationInput = {
        basic_salary: formData.basic_salary,
        ot_hourly_rate: formData.ot_hourly_rate || undefined,
        effective_from: formData.effective_from,
        effective_to: formData.effective_to || undefined,
        is_current: formData.is_current,
      };
      
      await employeeRelatedService.updateCompensation(compensation.id, payload);
      await loadCompensations();
      showSuccess('Compensation updated successfully!');
      setEditingIndex(null);
      editForm.reset();
    } catch (error: any) {
      console.error('Failed to update compensation:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to update compensation. Please check your connection and try again.';
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index: number) => {
    const compensation = compensations[index];
    if (!compensation.id) {
      showError('Error: Compensation ID is missing.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this compensation record?')) {
      return;
    }

    try {
      await employeeRelatedService.deleteCompensation(compensation.id);
      await loadCompensations();
      showSuccess('Compensation deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete compensation:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to delete compensation. Please try again.';
      showError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {import.meta.env.DEV && (
        <>
          <DevTool control={editForm.control} />
          <DevTool control={newForm.control} />
        </>
      )}
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Compensation History</h3>
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
          <div className="text-center py-8 text-gray-500">Loading compensation data...</div>
        ) : compensations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No compensation records found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {compensations.map((comp, index) => (
              <div key={comp.id}>
                <Paper variant="outlined" className="p-4">
                  {editingIndex === index ? (
                    <form onSubmit={editForm.handleSubmit(async () => await handleSave(index))}>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-900">Editing Compensation</h4>
                          <Chip
                            label={comp.is_current ? 'Current' : 'Historical'}
                            color={comp.is_current ? 'success' : 'default'}
                            size="small"
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Controller
                              name="basic_salary"
                              control={editForm.control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  label="Basic Salary"
                                  type="number"
                                  value={field.value || 0}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                  inputProps={{ min: 0, step: 0.01 }}
                                  variant="outlined"
                                  size="small"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <Controller
                              name="ot_hourly_rate"
                              control={editForm.control}
                              render={({ field, fieldState }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  label="OT Hourly Rate (optional)"
                                  type="number"
                                  value={field.value || ''}
                                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                  inputProps={{ min: 0, step: 0.01 }}
                                  variant="outlined"
                                  size="small"
                                />
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Controller
                                name="effective_from"
                                control={editForm.control}
                                render={({ field, fieldState }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    label="Effective From"
                                    type="date"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    size="small"
                                  />
                                )}
                              />
                            </div>
                            <div>
                              <Controller
                                name="effective_to"
                                control={editForm.control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    fullWidth
                                    label="Effective To (optional)"
                                    type="date"
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(e.target.value || undefined)}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    size="small"
                                  />
                                )}
                              />
                            </div>
                          </div>
                          <div>
                            <Controller
                              name="is_current"
                              control={editForm.control}
                              render={({ field }) => (
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={field.value || false}
                                    onChange={field.onChange}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm text-gray-700">This is the current compensation</span>
                                </label>
                              )}
                            />
                          </div>
                          <div>
                            <div className="flex gap-2">
                              <MuiButton
                                type="submit"
                                size="small"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={saving || editForm.formState.isSubmitting}
                              >
                                {saving || editForm.formState.isSubmitting ? 'Saving...' : 'Save'}
                              </MuiButton>
                              <MuiButton
                                type="button"
                                size="small"
                                variant="outlined"
                                startIcon={<Cancel />}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleCancelEdit();
                                }}
                                disabled={saving || editForm.formState.isSubmitting}
                              >
                                Cancel
                              </MuiButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-gray-500">Basic Salary</div>
                          <div className="text-lg font-semibold text-gray-900">
                            ${comp.basic_salary.toLocaleString()}
                          </div>
                        </div>
                        <Chip
                          label={comp.is_current ? 'Current' : 'Historical'}
                          color={comp.is_current ? 'success' : 'default'}
                          size="small"
                        />
                      </div>
                      
                      {comp.ot_hourly_rate && (
                        <div>
                          <div className="text-sm font-medium text-gray-500">OT Hourly Rate</div>
                          <div className="text-base text-gray-900">
                            ${comp.ot_hourly_rate.toLocaleString()}
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-sm font-medium text-gray-500">Effective From</div>
                          <div className="text-sm text-gray-900">
                            {new Date(comp.effective_from).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Effective To</div>
                          <div className="text-sm text-gray-900">
                            {comp.effective_to ? new Date(comp.effective_to).toLocaleDateString() : 'Current'}
                          </div>
                        </div>
                      </div>
                      
                      {isEditMode && (
                        <div className="flex gap-2 pt-2 border-t border-gray-200">
                          <MuiButton
                            size="small"
                            variant="outlined"
                            startIcon={<Edit />}
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </MuiButton>
                          <MuiButton
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDelete(index)}
                          >
                            Delete
                          </MuiButton>
                        </div>
                      )}
                    </div>
                  )}
                </Paper>
              </div>
            ))}
          </div>
        )}

        {isEditMode && !showAddForm && (
          <div className="mt-6">
            <MuiButton
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setShowAddForm(true)}
            >
              Add Compensation
            </MuiButton>
          </div>
        )}

        {isEditMode && showAddForm && (
          <div className="mt-6 space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Add New Compensation</h4>
              <form onSubmit={newForm.handleSubmit(handleAdd)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Controller
                      name="basic_salary"
                      control={newForm.control}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Basic Salary"
                          type="number"
                          value={field.value || 0}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          variant="outlined"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name="ot_hourly_rate"
                      control={newForm.control}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="OT Hourly Rate (optional)"
                          type="number"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          variant="outlined"
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name="effective_from"
                      control={newForm.control}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Effective From"
                          type="date"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name="effective_to"
                      control={newForm.control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Effective To (optional)"
                          type="date"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value || undefined)}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Controller
                      name="is_current"
                      control={newForm.control}
                      render={({ field }) => (
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.value || false}
                            onChange={field.onChange}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">This is the current compensation</span>
                        </label>
                      )}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex gap-2">
                      <MuiButton
                        type="submit"
                        variant="contained"
                        startIcon={<Add />}
                        disabled={newForm.formState.isSubmitting}
                      >
                        {newForm.formState.isSubmitting ? 'Adding...' : 'Add Compensation'}
                      </MuiButton>
                      <MuiButton
                        type="button"
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={() => {
                          newForm.reset();
                          setShowAddForm(false);
                        }}
                        disabled={newForm.formState.isSubmitting}
                      >
                        Cancel
                      </MuiButton>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </MuiCard>
    </div>
  );
};
