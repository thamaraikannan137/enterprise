import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { regularizationService } from '../services/regularizationService';
import type { RegularizationRequest } from '../types/regularization';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export const AttendanceAdminPage = () => {
  const [requests, setRequests] = useState<RegularizationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<RegularizationRequest | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    loadRequests();
  }, [filterStatus]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {};
      if (filterStatus !== 'all') {
        filters.status = filterStatus;
      }

      const response = await regularizationService.getRequests(filters);
      setRequests(response.requests);
    } catch (err: any) {
      setError(err.message || 'Failed to load regularization requests');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (request: RegularizationRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(type);
    setReviewNote('');
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedRequest) return;

    if (actionType === 'reject' && !reviewNote.trim()) {
      setError('Review note is required for rejection');
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      if (actionType === 'approve') {
        await regularizationService.approveRequest(selectedRequest.id, reviewNote || undefined);
        setSuccess('Request approved successfully!');
      } else {
        await regularizationService.rejectRequest(selectedRequest.id, reviewNote);
        setSuccess('Request rejected successfully!');
      }

      setReviewDialogOpen(false);
      setSelectedRequest(null);
      setReviewNote('');
      await loadRequests();
    } catch (err: any) {
      setError(err.message || 'Failed to process request');
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

  const getEmployeeName = (employee: any) => {
    if (typeof employee === 'object' && employee !== null) {
      return `${employee.first_name} ${employee.last_name} (${employee.employee_code})`;
    }
    return 'Unknown Employee';
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
        <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h4">Attendance Admin</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage attendance regularization requests
          </Typography>
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

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Pending Requests
              </Typography>
              <Typography variant="h3" color="warning.main">
                {pendingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Approved
              </Typography>
              <Typography variant="h3" color="success.main">
                {requests.filter((r) => r.status === 'approved').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Rejected
              </Typography>
              <Typography variant="h3" color="error.main">
                {requests.filter((r) => r.status === 'rejected').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <Typography variant="body1">Filter by Status:</Typography>
            <Button
              variant={filterStatus === 'all' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'contained' : 'outlined'}
              size="small"
              color="warning"
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === 'approved' ? 'contained' : 'outlined'}
              size="small"
              color="success"
              onClick={() => setFilterStatus('approved')}
            >
              Approved
            </Button>
            <Button
              variant={filterStatus === 'rejected' ? 'contained' : 'outlined'}
              size="small"
              color="error"
              onClick={() => setFilterStatus('rejected')}
            >
              Rejected
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Regularization Requests
          </Typography>
          {requests.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No requests found for the selected filter.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
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
                      <TableCell>{getEmployeeName(request.employeeId)}</TableCell>
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
                            // Navigate to detail page - could use React Router if needed
                            window.location.href = `/attendance/regularization/${request.id}`;
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        {request.status === 'pending' && (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleReview(request, 'approve')}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleReview(request, 'reject')}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </>
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

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Employee: {getEmployeeName(selectedRequest.employeeId)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Date: {formatDate(selectedRequest.attendanceDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                Reason: {selectedRequest.reason}
              </Typography>
              <TextField
                label={actionType === 'approve' ? 'Review Note (Optional)' : 'Review Note (Required)'}
                multiline
                rows={4}
                fullWidth
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder={
                  actionType === 'approve'
                    ? 'Add any notes about this approval...'
                    : 'Please provide a reason for rejection...'
                }
                required={actionType === 'reject'}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            color={actionType === 'approve' ? 'success' : 'error'}
          >
            {actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

