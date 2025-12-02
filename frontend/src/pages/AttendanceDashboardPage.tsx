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
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { attendanceService } from '../services/attendanceService';
import { employeeService } from '../services/employeeService';
import { useToast } from '../contexts/ToastContext';
import type { AttendanceLog, AttendanceStatus } from '../types/attendance';
import type { Employee } from '../types/employee';

interface AttendanceDashboardPageProps {
  employeeId?: string; // Will be passed from parent or fetched from context
}

export const AttendanceDashboardPage = ({ employeeId }: AttendanceDashboardPageProps) => {
  const { showSuccess, showError } = useToast();
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string>('');
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [status, setStatus] = useState<AttendanceStatus | null>(null);
  const [todayLogs, setTodayLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch first employee from database on mount
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        // If employeeId is passed as prop, use it
        if (employeeId) {
          setCurrentEmployeeId(employeeId);
          return;
        }

        // Otherwise, fetch the first employee from database
        const employeesResponse = await employeeService.getEmployees({ limit: 1 });
        
        if (employeesResponse.employees && employeesResponse.employees.length > 0) {
          const firstEmployee = employeesResponse.employees[0];
          setCurrentEmployeeId(firstEmployee.id);
          setCurrentEmployee(firstEmployee);
        } else {
          setError('No employees found in the database. Please create an employee first.');
          setLoading(false);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch employee data');
        setLoading(false);
      }
    };

    fetchEmployeeId();
  }, [employeeId]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load attendance data when employeeId is available
  useEffect(() => {
    if (currentEmployeeId) {
      loadAttendanceData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEmployeeId]);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statusData, todayData] = await Promise.all([
        attendanceService.getCurrentStatus(currentEmployeeId),
        attendanceService.getTodayAttendance(currentEmployeeId),
      ]);

      setStatus(statusData);
      setTodayLogs(todayData);
    } catch (err: any) {
      setError(err.message || 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleClockInOut = async () => {
    try {
      setActionLoading(true);
      setError(null);

      // Get user's current location
      let locationAddress;
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });

        locationAddress = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          addressLine1: 'Location captured',
        };
      } catch (geoError) {
        console.warn('Location access denied or unavailable:', geoError);
      }

      if (status?.status === 'IN') {
        // Clock out
        await attendanceService.clockOut({
          employeeId: currentEmployeeId,
          locationAddress,
        });
        showSuccess('Clocked out successfully!');
      } else {
        // Clock in
        await attendanceService.clockIn({
          employeeId: currentEmployeeId,
          locationAddress,
        });
        showSuccess('Clocked in successfully!');
      }

      await loadAttendanceData();
    } catch (err: any) {
      const errorMessage = err.message || `Failed to clock ${status?.status === 'IN' ? 'out' : 'in'}`;
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDateForDisplay = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTimeForDisplay = (date: Date) => {
    const timeString = date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    // Split time string to separate large and small parts
    // Format: "02:28:18 PM" -> "02:28" (large) and ":18 PM" (small)
    const parts = timeString.split(' ');
    const timePart = parts[0]; // "02:28:18"
    const ampm = parts[1] || ''; // "PM"
    const timeComponents = timePart.split(':');
    const hours = timeComponents[0];
    const minutes = timeComponents[1];
    const seconds = timeComponents[2];
    
    return {
      large: `${hours}:${minutes}`,
      small: `:${seconds} ${ampm}`
    };
  };

  if (!currentEmployeeId && !loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          {error || 'Employee ID is required to access attendance. Please create an employee first.'}
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const isClockedIn = status?.status === 'IN';

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">
          Attendance Dashboard
        </Typography>
        {currentEmployee && (
          <Chip
            label={`${currentEmployee.first_name} ${currentEmployee.last_name} (${currentEmployee.employee_code})`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Time Today Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
              borderRadius: 3,
              color: 'white',
            }}
          >
            <CardContent>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Typography variant="body1" fontWeight="medium">
                  Time Today - {formatDateForDisplay(currentTime)}
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  View All
                </Button>
              </Box>

              {/* Current Time Section */}
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mb: 1, 
                    opacity: 0.9,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  CURRENT TIME
                </Typography>
                <Box display="flex" alignItems="baseline" gap={0.5}>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: '2.5rem', sm: '3rem' },
                      lineHeight: 1,
                    }}
                  >
                    {formatTimeForDisplay(currentTime).large}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.875rem',
                      opacity: 0.9,
                      alignSelf: 'flex-end',
                      pb: 0.5,
                    }}
                  >
                    {formatTimeForDisplay(currentTime).small}
                  </Typography>
                </Box>
              </Box>

              {/* Clock In/Out Button */}
              <Button
                variant="contained"
                fullWidth
                onClick={handleClockInOut}
                disabled={actionLoading}
                sx={{
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 'medium',
                  boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                  '&:hover': {
                    backgroundColor: '#ff5252',
                    boxShadow: '0 6px 16px rgba(255, 107, 107, 0.4)',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                {actionLoading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  isClockedIn ? 'Clock-out' : 'Clock-in'
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Summary Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Activity
              </Typography>
              {todayLogs.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  No attendance records for today
                </Typography>
              ) : (
                <List>
                  {todayLogs.map((log, index) => (
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
                      {index < todayLogs.length - 1 && <Divider />}
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

