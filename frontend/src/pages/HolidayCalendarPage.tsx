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
  MenuItem,
} from '@mui/material';
import { holidayService } from '../services/holidayService';
import type { Holiday, CreateHolidayInput } from '../types/holiday';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';

export const HolidayCalendarPage = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [formData, setFormData] = useState<CreateHolidayInput>({
    date: '',
    name: '',
    type: 'National',
    isActive: true,
  });

  useEffect(() => {
    loadHolidays();
  }, [selectedYear]);

  const loadHolidays = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await holidayService.getHolidays({ year: selectedYear });
      console.log('Loaded holidays:', data);
      // Ensure all holidays have an id field
      const holidaysWithIds = data.map((holiday: any) => ({
        ...holiday,
        id: holiday.id || holiday._id || holiday.id,
      }));
      console.log('Holidays with IDs:', holidaysWithIds);
      setHolidays(holidaysWithIds as Holiday[]);
    } catch (err: any) {
      setError(err.message || 'Failed to load holidays');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (holiday?: Holiday) => {
    if (holiday) {
      console.log('Opening edit dialog for holiday:', holiday);
      console.log('Holiday ID:', holiday.id);
      console.log('Holiday _id:', (holiday as any)._id);
      // Ensure we have a valid ID
      if (!holiday.id && (holiday as any)._id) {
        (holiday as any).id = (holiday as any)._id;
      }
      if (!holiday.id) {
        setError('Holiday ID is missing. Cannot edit this holiday.');
        return;
      }
      setEditingHoliday(holiday);
      setFormData({
        date: holiday.date.split('T')[0],
        name: holiday.name,
        type: holiday.type,
        isActive: holiday.isActive,
      });
    } else {
      setEditingHoliday(null);
      setFormData({
        date: '',
        name: '',
        type: 'National',
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingHoliday(null);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      setError('Holiday name is required');
      return;
    }

    if (!formData.date) {
      setError('Date is required');
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      if (editingHoliday) {
        console.log('Submitting update for holiday ID:', editingHoliday.id);
        console.log('Update data:', formData);
        if (!editingHoliday.id) {
          setError('Holiday ID is missing. Cannot update this holiday.');
          return;
        }
        await holidayService.updateHoliday(editingHoliday.id, formData);
        setSuccess('Holiday updated successfully!');
      } else {
        await holidayService.createHoliday(formData);
        setSuccess('Holiday created successfully!');
      }

      handleCloseDialog();
      await loadHolidays();
    } catch (err: any) {
      console.error('Error saving holiday:', err);
      console.error('Error details:', {
        response: err.response,
        data: err.response?.data,
        message: err.message,
      });
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Failed to save holiday';
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || id === 'undefined') {
      setError('Invalid holiday ID. Cannot delete this holiday.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this holiday?')) return;

    try {
      setError(null);
      setSuccess(null);
      console.log('Deleting holiday with ID:', id);
      await holidayService.deleteHoliday(id);
      setSuccess('Holiday deleted successfully!');
      await loadHolidays();
    } catch (err: any) {
      console.error('Error deleting holiday:', err);
      console.error('Error details:', {
        response: err.response,
        data: err.response?.data,
        message: err.message,
      });
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Failed to delete holiday';
      setError(errorMessage);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'National':
        return 'primary';
      case 'Regional':
        return 'secondary';
      case 'Company':
        return 'success';
      default:
        return 'default';
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

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
          <EventIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4">Holiday Calendar</Typography>
        </Box>
        <Box display="flex" gap={2}>
          <TextField
            select
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            size="small"
            sx={{ minWidth: 120 }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            New Holiday
          </Button>
        </Box>
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
          {holidays.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No holidays found for {selectedYear}. Create a new holiday to get started.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {holidays.map((holiday) => (
                    <TableRow key={holiday.id}>
                      <TableCell>
                        {new Date(holiday.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                      </TableCell>
                      <TableCell>{holiday.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={holiday.type}
                          color={getTypeColor(holiday.type) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={holiday.isActive ? 'Active' : 'Inactive'}
                          color={holiday.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            const holidayId = holiday.id || (holiday as any)._id;
                            if (!holidayId) {
                              setError('Holiday ID is missing. Cannot edit this holiday.');
                              return;
                            }
                            handleOpenDialog(holiday);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => {
                            const holidayId = holiday.id || (holiday as any)._id;
                            if (!holidayId) {
                              setError('Holiday ID is missing. Cannot delete this holiday.');
                              return;
                            }
                            handleDelete(holidayId);
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
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingHoliday ? 'Edit Holiday' : 'Create New Holiday'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Holiday Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Type"
                fullWidth
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                required
              >
                <MenuItem value="National">National</MenuItem>
                <MenuItem value="Regional">Regional</MenuItem>
                <MenuItem value="Company">Company</MenuItem>
              </TextField>
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
            {editingHoliday ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

