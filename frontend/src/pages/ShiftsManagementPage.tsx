import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { shiftService } from '../services/shiftService';
import type { Shift, CreateShiftInput } from '../types/shift';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';

export const ShiftsManagementPage = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [formData, setFormData] = useState<CreateShiftInput>({
    name: '',
    startTime: '09:00',
    endTime: '18:00',
    breakDuration: 1,
    effectiveDuration: 8,
    halfDayDuration: 4,
    presentHours: 8,
    halfDayHours: 4,
    isActive: true,
  });

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await shiftService.getShifts();
      console.log('Loaded shifts:', data);
      // Ensure all shifts have an id field
      const shiftsWithIds = data.map((shift: any) => ({
        ...shift,
        id: shift.id || shift._id || shift.id,
      }));
      console.log('Shifts with IDs:', shiftsWithIds);
      setShifts(shiftsWithIds as Shift[]);
    } catch (err: any) {
      setError(err.message || 'Failed to load shifts');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (shift?: Shift) => {
    if (shift) {
      console.log('Opening edit dialog for shift:', shift);
      console.log('Shift ID:', shift.id);
      console.log('Shift _id:', (shift as any)._id);
      // Ensure we have a valid ID
      if (!shift.id && (shift as any)._id) {
        (shift as any).id = (shift as any)._id;
      }
      if (!shift.id) {
        setError('Shift ID is missing. Cannot edit this shift.');
        return;
      }
      setEditingShift(shift);
      setFormData({
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        breakDuration: shift.breakDuration,
        effectiveDuration: shift.effectiveDuration,
        halfDayDuration: shift.halfDayDuration,
        presentHours: shift.presentHours,
        halfDayHours: shift.halfDayHours,
        isActive: shift.isActive,
      });
    } else {
      setEditingShift(null);
      setFormData({
        name: '',
        startTime: '09:00',
        endTime: '18:00',
        breakDuration: 1,
        effectiveDuration: 8,
        halfDayDuration: 4,
        presentHours: 8,
        halfDayHours: 4,
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingShift(null);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      setError('Shift name is required');
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setError('Start time and end time are required');
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      // Prepare data with proper number types
      const submitData: CreateShiftInput = {
        name: formData.name.trim(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        breakDuration: Number(formData.breakDuration) || 0,
        effectiveDuration: Number(formData.effectiveDuration) || 0,
        halfDayDuration: Number(formData.halfDayDuration) || 0,
        presentHours: Number(formData.presentHours) || 0,
        halfDayHours: Number(formData.halfDayHours) || 0,
        isActive: formData.isActive,
      };

      if (editingShift) {
        console.log('Submitting update for shift ID:', editingShift.id);
        console.log('Update data:', submitData);
        await shiftService.updateShift(editingShift.id, submitData);
        setSuccess('Shift updated successfully!');
      } else {
        await shiftService.createShift(submitData);
        setSuccess('Shift created successfully!');
      }

      handleCloseDialog();
      await loadShifts();
    } catch (err: any) {
      console.error('Error saving shift:', err);
      console.error('Error details:', {
        response: err.response,
        data: err.response?.data,
        message: err.message,
      });
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Failed to save shift';
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || id === 'undefined') {
      setError('Invalid shift ID. Cannot delete this shift.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this shift?')) return;

    try {
      setError(null);
      setSuccess(null);
      console.log('Deleting shift with ID:', id);
      await shiftService.deleteShift(id);
      setSuccess('Shift deleted successfully!');
      await loadShifts();
    } catch (err: any) {
      console.error('Error deleting shift:', err);
      console.error('Error details:', {
        response: err.response,
        data: err.response?.data,
        message: err.message,
      });
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Failed to delete shift';
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <ScheduleIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4">Shifts Management</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          New Shift
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          {shifts.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No shifts found. Create a new shift to get started.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Break</TableCell>
                    <TableCell>Effective Hours</TableCell>
                    <TableCell>Present Hours</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell>{shift.name}</TableCell>
                      <TableCell>
                        {shift.startTime} - {shift.endTime}
                      </TableCell>
                      <TableCell>{shift.breakDuration}h</TableCell>
                      <TableCell>{shift.effectiveDuration}h</TableCell>
                      <TableCell>{shift.presentHours}h</TableCell>
                      <TableCell>
                        <Chip
                          label={shift.isActive ? 'Active' : 'Inactive'}
                          color={shift.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            const shiftId = shift.id || (shift as any)._id;
                            if (!shiftId) {
                              setError('Shift ID is missing. Cannot edit this shift.');
                              return;
                            }
                            handleOpenDialog(shift);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => {
                            const shiftId = shift.id || (shift as any)._id;
                            if (!shiftId) {
                              setError('Shift ID is missing. Cannot delete this shift.');
                              return;
                            }
                            handleDelete(shiftId);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingShift ? 'Edit Shift' : 'Create New Shift'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Shift Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Start Time"
                type="time"
                fullWidth
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Time"
                type="time"
                fullWidth
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Break Duration (hours)"
                type="number"
                fullWidth
                value={formData.breakDuration}
                onChange={(e) => setFormData({ ...formData, breakDuration: parseFloat(e.target.value) || 0 })}
                inputProps={{ min: 0, step: 0.5 }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Effective Duration (hours)"
                type="number"
                fullWidth
                value={formData.effectiveDuration}
                onChange={(e) => setFormData({ ...formData, effectiveDuration: parseFloat(e.target.value) || 0 })}
                inputProps={{ min: 0, step: 0.5 }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Half Day Duration (hours)"
                type="number"
                fullWidth
                value={formData.halfDayDuration}
                onChange={(e) => setFormData({ ...formData, halfDayDuration: parseFloat(e.target.value) || 0 })}
                inputProps={{ min: 0, step: 0.5 }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Present Hours (minimum)"
                type="number"
                fullWidth
                value={formData.presentHours}
                onChange={(e) => setFormData({ ...formData, presentHours: parseFloat(e.target.value) || 0 })}
                inputProps={{ min: 0, step: 0.5 }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Half Day Hours (minimum)"
                type="number"
                fullWidth
                value={formData.halfDayHours}
                onChange={(e) => setFormData({ ...formData, halfDayHours: parseFloat(e.target.value) || 0 })}
                inputProps={{ min: 0, step: 0.5 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingShift ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

