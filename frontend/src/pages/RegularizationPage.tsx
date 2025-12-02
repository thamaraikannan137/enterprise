import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import { regularizationService } from '../services/regularizationService';
import { employeeService } from '../services/employeeService';
import { attendanceService } from '../services/attendanceService';
import type { RegularizationRequest } from '../types/regularization';
import type { Employee } from '../types/employee';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

export const RegularizationPage = () => {
  const navigate = useNavigate();
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string>('');
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [requests, setRequests] = useState<RegularizationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const employeesResponse = await employeeService.getEmployees({ limit: 1 });
        
        if (employeesResponse.employees && employeesResponse.employees.length > 0) {
          const firstEmployee = employeesResponse.employees[0];
          setCurrentEmployeeId(firstEmployee.id);
          setCurrentEmployee(firstEmployee);
        } else {
          setError('No employees found in the database.');
          setLoading(false);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch employee data');
        setLoading(false);
      }
    };

    fetchEmployeeId();
  }, []);

  useEffect(() => {
    if (currentEmployeeId) {
      loadRequests();
    }
  }, [currentEmployeeId]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await regularizationService.getRequests({
        employeeId: currentEmployeeId,
      });

      setRequests(response.requests);
    } catch (err: any) {
      setError(err.message || 'Failed to load regularization requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!selectedDate || !reason.trim()) {
      setError('Please select a date and provide a reason');
      return;
    }

    try {
      setError(null);
      await regularizationService.createRequest({
        employeeId: currentEmployeeId,
        attendanceDate: selectedDate,
        reason: reason.trim(),
        requestedChanges: [
          {
            type: 'adjust_time',
            note: reason,
          },
        ],
      });

      setSuccess('Regularization request created successfully!');
      setDialogOpen(false);
      setSelectedDate('');
      setReason('');
      await loadRequests();
    } catch (err: any) {
      setError(err.message || 'Failed to create regularization request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon fontSize="small" />;
      case 'rejected':
        return <CancelIcon fontSize="small" />;
      case 'pending':
        return <PendingIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
        <Typography variant="h4">Regularization Requests</Typography>
        {currentEmployee && (
          <Chip
            label={`${currentEmployee.first_name} ${currentEmployee.last_name}`}
            color="primary"
            variant="outlined"
          />
        )}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          New Request
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
          {requests.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No regularization requests found. Create a new request to get started.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{formatDate(request.attendanceDate)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                          {request.reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(request.status)}
                          label={request.status}
                          color={getStatusColor(request.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => {
                            navigate(`/attendance/regularization/${request.id}`);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        {request.status === 'pending' && (
                          <IconButton
                            size="small"
                            onClick={() => {
                              navigate(`/attendance/regularization/${request.id}`);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create Request Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Regularization Request</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Attendance Date"
                type="date"
                fullWidth
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reason"
                multiline
                rows={4}
                fullWidth
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for this regularization request..."
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateRequest} variant="contained">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

