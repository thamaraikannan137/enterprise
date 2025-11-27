import { useState, useEffect } from 'react';
import { MuiCard, MuiButton } from '../../../common';
import { Edit, Save, Cancel, Add } from '@mui/icons-material';
import { TextField, Grid, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { employeeRelatedService } from '../../../../services/employeeRelatedService';
import type { EmployeeWithDetails } from '../../../../types/employee';
import type { EmployeeWorkPass, CreateEmployeeWorkPassInput } from '../../../../types/employeeRelated';

interface WorkPassTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

export const WorkPassTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: WorkPassTabProps) => {
  const [workPasses, setWorkPasses] = useState<EmployeeWorkPass[]>([]);
  const [loading, setLoading] = useState(false);
  const [newWorkPass, setNewWorkPass] = useState<CreateEmployeeWorkPassInput>({
    employee_id: employee.id,
    status: 'new',
    is_current: true,
  });

  useEffect(() => {
    loadWorkPasses();
  }, [employee.id]);

  const loadWorkPasses = async () => {
    setLoading(true);
    try {
      const data = await employeeRelatedService.getEmployeeWorkPasses(employee.id);
      setWorkPasses(data);
    } catch (error) {
      console.error('Failed to load work passes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await employeeRelatedService.createWorkPass(newWorkPass);
      await loadWorkPasses();
      setNewWorkPass({
        employee_id: employee.id,
        status: 'new',
        is_current: true,
      });
    } catch (error) {
      console.error('Failed to create work pass:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
      new: 'success',
      renewal: 'info',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="space-y-6">
      <MuiCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Work Pass Information</h3>
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
          <div className="text-center py-8 text-gray-500">Loading work pass information...</div>
        ) : workPasses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No work pass information available.
          </div>
        ) : (
          <div className="space-y-4">
            {workPasses.map((wp) => (
              <div key={wp.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <Chip
                    label={wp.status}
                    color={getStatusColor(wp.status)}
                    size="small"
                  />
                  {wp.is_current && (
                    <Chip label="Current" color="success" size="small" />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {wp.work_permit_number && (
                    <div>
                      <span className="text-gray-500">Work Permit Number: </span>
                      <span className="text-gray-900 font-medium">{wp.work_permit_number}</span>
                    </div>
                  )}
                  {wp.fin_number && (
                    <div>
                      <span className="text-gray-500">FIN Number: </span>
                      <span className="text-gray-900 font-medium">{wp.fin_number}</span>
                    </div>
                  )}
                  {wp.application_date && (
                    <div>
                      <span className="text-gray-500">Application Date: </span>
                      <span className="text-gray-900">
                        {new Date(wp.application_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {wp.issuance_date && (
                    <div>
                      <span className="text-gray-500">Issuance Date: </span>
                      <span className="text-gray-900">
                        {new Date(wp.issuance_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {wp.expiry_date && (
                    <div>
                      <span className="text-gray-500">Expiry Date: </span>
                      <span className="text-gray-900">
                        {new Date(wp.expiry_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {wp.medical_date && (
                    <div>
                      <span className="text-gray-500">Medical Date: </span>
                      <span className="text-gray-900">
                        {new Date(wp.medical_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isEditMode && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Add New Work Pass</h4>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newWorkPass.status}
                    onChange={(e) => setNewWorkPass({
                      ...newWorkPass,
                      status: e.target.value as any,
                    })}
                    label="Status"
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="renewal">Renewal</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Work Permit Number"
                  value={newWorkPass.work_permit_number || ''}
                  onChange={(e) => setNewWorkPass({ ...newWorkPass, work_permit_number: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="FIN Number"
                  value={newWorkPass.fin_number || ''}
                  onChange={(e) => setNewWorkPass({ ...newWorkPass, fin_number: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Application Date"
                  type="date"
                  value={newWorkPass.application_date || ''}
                  onChange={(e) => setNewWorkPass({ ...newWorkPass, application_date: e.target.value })}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Issuance Date"
                  type="date"
                  value={newWorkPass.issuance_date || ''}
                  onChange={(e) => setNewWorkPass({ ...newWorkPass, issuance_date: e.target.value })}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  type="date"
                  value={newWorkPass.expiry_date || ''}
                  onChange={(e) => setNewWorkPass({ ...newWorkPass, expiry_date: e.target.value })}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Medical Date"
                  type="date"
                  value={newWorkPass.medical_date || ''}
                  onChange={(e) => setNewWorkPass({ ...newWorkPass, medical_date: e.target.value })}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newWorkPass.is_current}
                    onChange={(e) => setNewWorkPass({ ...newWorkPass, is_current: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">This is the current work pass</span>
                </label>
              </Grid>
              <Grid item xs={12}>
                <MuiButton
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAdd}
                >
                  Add Work Pass
                </MuiButton>
              </Grid>
            </Grid>
          </div>
        )}
      </MuiCard>
    </div>
  );
};


