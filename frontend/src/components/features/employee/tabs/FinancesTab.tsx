import { useState, useEffect } from 'react';
import { MuiCard, MuiButton } from '../../../common';
import { Edit, Save, Cancel, Add } from '@mui/icons-material';
import { TextField, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { employeeRelatedService } from '../../../../services/employeeRelatedService';
import type { EmployeeWithDetails } from '../../../../types/employee';
import type { EmployeeCompensation, CreateEmployeeCompensationInput } from '../../../../types/employeeRelated';

interface FinancesTabProps {
  employee: EmployeeWithDetails;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

export const FinancesTab = ({
  employee,
  isEditMode,
  onEditModeChange,
}: FinancesTabProps) => {
  const [compensations, setCompensations] = useState<EmployeeCompensation[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCompensation, setNewCompensation] = useState<CreateEmployeeCompensationInput>({
    employee_id: employee.id,
    basic_salary: 0,
    effective_from: new Date().toISOString().split('T')[0],
    is_current: true,
  });

  useEffect(() => {
    loadCompensations();
  }, [employee.id]);

  const loadCompensations = async () => {
    setLoading(true);
    try {
      const data = await employeeRelatedService.getEmployeeCompensations(employee.id);
      setCompensations(data);
    } catch (error) {
      console.error('Failed to load compensations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await employeeRelatedService.createCompensation(newCompensation);
      await loadCompensations();
      setNewCompensation({
        employee_id: employee.id,
        basic_salary: 0,
        effective_from: new Date().toISOString().split('T')[0],
        is_current: true,
      });
    } catch (error) {
      console.error('Failed to create compensation:', error);
    }
  };

  const handleSave = async (index: number) => {
    // TODO: Implement update
    setEditingIndex(null);
    await loadCompensations();
  };

  return (
    <div className="space-y-6">
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
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Basic Salary</TableCell>
                  <TableCell>OT Rate</TableCell>
                  <TableCell>Effective From</TableCell>
                  <TableCell>Effective To</TableCell>
                  <TableCell>Status</TableCell>
                  {isEditMode && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {compensations.map((comp, index) => (
                  <TableRow key={comp.id}>
                    <TableCell>${comp.basic_salary.toLocaleString()}</TableCell>
                    <TableCell>
                      {comp.ot_hourly_rate ? `$${comp.ot_hourly_rate.toLocaleString()}` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {new Date(comp.effective_from).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {comp.effective_to ? new Date(comp.effective_to).toLocaleDateString() : 'Current'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        comp.is_current ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {comp.is_current ? 'Current' : 'Historical'}
                      </span>
                    </TableCell>
                    {isEditMode && (
                      <TableCell>
                        <MuiButton
                          size="small"
                          variant="outlined"
                          onClick={() => setEditingIndex(index)}
                        >
                          Edit
                        </MuiButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {isEditMode && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Add New Compensation</h4>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Basic Salary"
                  type="number"
                  value={newCompensation.basic_salary}
                  onChange={(e) => setNewCompensation({
                    ...newCompensation,
                    basic_salary: parseFloat(e.target.value) || 0,
                  })}
                  variant="outlined"
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="OT Hourly Rate (optional)"
                  type="number"
                  value={newCompensation.ot_hourly_rate || ''}
                  onChange={(e) => setNewCompensation({
                    ...newCompensation,
                    ot_hourly_rate: e.target.value ? parseFloat(e.target.value) : undefined,
                  })}
                  variant="outlined"
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Effective From"
                  type="date"
                  value={newCompensation.effective_from}
                  onChange={(e) => setNewCompensation({
                    ...newCompensation,
                    effective_from: e.target.value,
                  })}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Effective To (optional)"
                  type="date"
                  value={newCompensation.effective_to || ''}
                  onChange={(e) => setNewCompensation({
                    ...newCompensation,
                    effective_to: e.target.value || undefined,
                  })}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <MuiButton
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAdd}
                >
                  Add Compensation
                </MuiButton>
              </Grid>
            </Grid>
          </div>
        )}
      </MuiCard>
    </div>
  );
};
