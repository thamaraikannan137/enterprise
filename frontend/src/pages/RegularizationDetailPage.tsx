import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import { regularizationService } from '../services/regularizationService';
import { attendanceService } from '../services/attendanceService';
import type { RegularizationRequest } from '../types/regularization';
import type { AttendanceLog } from '../types/attendance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const RegularizationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RegularizationRequest | null>(null);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (id) {
      loadRequest();
    }
  }, [id]);

  const loadRequest = async () => {
    try {
      setLoading(true);
      setError(null);

      const requestData = await regularizationService.getRequestById(id!);
      setRequest(requestData);
      setReason(requestData.reason);

      // Load attendance logs for that date
      if (requestData.attendanceDate) {
        const date = new Date(requestData.attendanceDate);
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const logs = await attendanceService.getAttendanceLogs(
          typeof requestData.employeeId === 'string' 
            ? requestData.employeeId 
            : (requestData.employeeId as any).id || (requestData.employeeId as any)._id,
          {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          }
        );

        setAttendanceLogs(logs.logs);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load regularization request');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!reason.trim()) {
      setError('Reason is required');
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      await regularizationService.updateRequest(id!, { reason });
      setSuccess('Request updated successfully!');
      setEditMode(false);
      await loadRequest();
    } catch (err: any) {
      setError(err.message || 'Failed to update request');
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
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getEmployeeName = (employee: any) => {
    if (typeof employee === 'object' && employee !== null) {
      return `${employee.first_name} ${employee.last_name} (${employee.employee_code})`;
    }
    return 'Unknown Employee';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!request) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Regularization request not found</Alert>
      </Box>
    );
  }

  const canEdit = request.status === 'pending';

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/attendance/regularization')}
        >
          Back
        </Button>
        <Typography variant="h4">Regularization Request Details</Typography>
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

      <Grid container spacing={3}>
        {/* Request Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Request Information</Typography>
                {canEdit && !editMode && (
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Employee
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {getEmployeeName(request.employeeId)}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Attendance Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(request.attendanceDate)}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    icon={getStatusIcon(request.status)}
                    label={request.status}
                    color={getStatusColor(request.status) as any}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Reason
                  </Typography>
                  {editMode ? (
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      sx={{ mt: 1 }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {request.reason}
                    </Typography>
                  )}
                </Grid>

                {request.reviewedBy && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Reviewed By
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {typeof request.reviewedBy === 'object'
                          ? `${request.reviewedBy.firstName} ${request.reviewedBy.lastName}`
                          : 'Admin'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Reviewed At
                      </Typography>
                      <Typography variant="body1">
                        {request.reviewedAt
                          ? formatDate(request.reviewedAt) +
                            ' ' +
                            formatTime(request.reviewedAt)
                          : 'N/A'}
                      </Typography>
                    </Grid>

                    {request.reviewNote && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Review Note
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                          {request.reviewNote}
                        </Typography>
                      </Grid>
                    )}
                  </>
                )}

                {editMode && (
                  <Grid item xs={12}>
                    <Box display="flex" gap={2}>
                      <Button
                        variant="contained"
                        onClick={handleUpdate}
                        disabled={!reason.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEditMode(false);
                          setReason(request.reason);
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Requested Changes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Requested Changes
              </Typography>
              {request.requestedChanges && request.requestedChanges.length > 0 ? (
                <List>
                  {request.requestedChanges.map((change, index) => (
                    <Box key={index}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Chip
                                label={change.type.replace('_', ' ')}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              {change.newTimestamp && (
                                <Typography variant="body2" color="text.secondary">
                                  New Time: {formatTime(change.newTimestamp)}
                                </Typography>
                              )}
                              {change.note && (
                                <Typography variant="body2" color="text.secondary">
                                  Note: {change.note}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < request.requestedChanges.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No specific changes requested
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance Logs for the Date */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <AccessTimeIcon color="primary" />
                <Typography variant="h6">Attendance Logs for {formatDate(request.attendanceDate)}</Typography>
              </Box>

              {attendanceLogs.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No attendance logs found for this date
                </Typography>
              ) : (
                <List>
                  {attendanceLogs.map((log, index) => (
                    <Box key={log.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Chip
                                label={log.event}
                                color={log.event === 'IN' ? 'success' : 'error'}
                                size="small"
                              />
                              <Typography variant="body1" fontWeight="medium">
                                {formatTime(log.timestamp)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {log.hasAddress && log.locationAddress?.addressLine1
                                  ? log.locationAddress.addressLine1
                                  : 'Location not available'}
                              </Typography>
                              {log.note && (
                                <Typography variant="caption" color="text.secondary">
                                  Note: {log.note}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < attendanceLogs.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};


