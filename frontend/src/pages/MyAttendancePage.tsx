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
  Select,
  MenuItem,
  FormControl,
  LinearProgress,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { attendanceService } from '../services/attendanceService';
import { employeeService } from '../services/employeeService';
import { shiftService } from '../services/shiftService';
import { useAppSelector } from '../store';
import { useToast } from '../contexts/ToastContext';
import { getCurrentLocationWithAddress } from '../utils/locationUtils';
import type { AttendanceLog } from '../types/attendance';
import type { Shift } from '../types/shift';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CoffeeIcon from '@mui/icons-material/Coffee';

interface AttendanceDashboardPageProps {
  employeeId?: string;
}

interface AttendanceStats {
  avgHoursPerDay: string;
  onTimeArrival: number;
}

interface ClockEvent {
  timestamp: string;
  event: 'IN' | 'OUT';
}

interface AttendanceSegment {
  inTime: string;
  outTime: string | null;
  duration: number; // in minutes
}

interface DayAttendance {
  date: string;
  grossHours: string;
  arrival: string;
  arrivalStatus: 'on-time' | 'late' | null;
  logStatus: 'success' | 'warning' | 'pending';
  attendanceVisual: {
    hasData: boolean;
    segments: AttendanceSegment[];
    allEvents: ClockEvent[];
  } | null;
}

export const MyAttendancePage = ({ employeeId }: AttendanceDashboardPageProps) => {
  const { currentEmployee } = useAppSelector((state) => state.employee);
  const { showSuccess, showError } = useToast();
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Stats
  const [statsPeriod, setStatsPeriod] = useState('lastWeek');
  const [myStats] = useState<AttendanceStats>({ avgHoursPerDay: '9h 45m', onTimeArrival: 80 });
  const [teamStats] = useState<AttendanceStats>({ avgHoursPerDay: '9h 58m', onTimeArrival: 90 });
  
  // Timings
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [is24HourFormat, setIs24HourFormat] = useState(false);
  
  // Actions
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState<'IN' | 'OUT' | null>(null);
  const [effectiveHours] = useState('0h 24m');
  const [grossHours] = useState('0h 24m');
  const [timeSinceLogin] = useState('0h:24m');
  
  // Logs & Requests
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('30 DAYS');
  const [attendanceLogs, setAttendanceLogs] = useState<DayAttendance[]>([]);
  
  const dayAbbreviations = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        if (employeeId) {
          setCurrentEmployeeId(employeeId);
          return;
        }

        if (currentEmployee) {
          setCurrentEmployeeId(currentEmployee.id);
          return;
        }

        const employeesResponse = await employeeService.getEmployees({ limit: 1 });
        
        if (employeesResponse.employees && employeesResponse.employees.length > 0) {
          const firstEmployee = employeesResponse.employees[0];
          setCurrentEmployeeId(firstEmployee.id);
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
  }, [employeeId, currentEmployee]);

  // Fetch attendance data
  useEffect(() => {
    if (currentEmployeeId) {
      loadAttendanceData();
    }
  }, [currentEmployeeId, statsPeriod, selectedPeriod]);

  // Fetch shift data
  useEffect(() => {
    const loadShift = async () => {
      try {
        const shifts = await shiftService.getShifts({ isActive: true });
        if (shifts.length > 0) {
          setCurrentShift(shifts[0]);
        }
      } catch (err) {
        console.error('Failed to load shift:', err);
      }
    };
    loadShift();
  }, []);

  // Fetch attendance status
  useEffect(() => {
    if (currentEmployeeId) {
      const loadStatus = async () => {
        try {
          const status = await attendanceService.getCurrentStatus(currentEmployeeId);
          setAttendanceStatus(status.status);
        } catch (err) {
          console.error('Failed to load attendance status:', err);
        }
      };
      loadStatus();
    }
  }, [currentEmployeeId]);

  const getDateRangeForPeriod = (period: string): { startDate: Date; endDate: Date } => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    if (period === '30 DAYS') {
      const endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999); // Include full day of today
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 29); // 29 days ago + today = 30 days total
      startDate.setHours(0, 0, 0, 0);
      return { startDate, endDate };
    }
    
    // Handle month selection (DEC, NOV, OCT, etc.)
    const monthIndex = monthNames.indexOf(period);
    if (monthIndex !== -1) {
      const startDate = new Date(currentYear, monthIndex, 1);
      const endDate = new Date(currentYear, monthIndex + 1, 0, 23, 59, 59, 999);
      return { startDate, endDate };
    }
    
    // Default to last 30 days
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 30);
    return { startDate, endDate };
  };

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { startDate, endDate } = getDateRangeForPeriod(selectedPeriod);

      const logsResponse = await attendanceService.getAttendanceLogs(currentEmployeeId, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      // Process logs into day attendance
      const processedLogs = processAttendanceLogs(logsResponse.logs, startDate, endDate);
      setAttendanceLogs(processedLogs);

      // Calculate stats (mock for now - would need actual calculation)
      // In real implementation, calculate from logsResponse.logs
      
    } catch (err: any) {
      setError(err.message || 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const processClockEvents = (dayLogs: AttendanceLog[]): { segments: AttendanceSegment[]; allEvents: ClockEvent[]; totalMinutes: number } => {
    // Sort logs by timestamp
    const sortedLogs = [...dayLogs].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const allEvents: ClockEvent[] = sortedLogs.map(log => ({
      timestamp: log.timestamp,
      event: log.event,
    }));
    
    const segments: AttendanceSegment[] = [];
    let totalMinutes = 0;
    let currentInTime: string | null = null;
    
    for (const log of sortedLogs) {
      if (log.event === 'IN') {
        // If there's a pending IN without OUT, close it first
        if (currentInTime) {
          // Use current IN time as OUT (edge case)
          segments.push({
            inTime: currentInTime,
            outTime: log.timestamp,
            duration: 0,
          });
        }
        currentInTime = log.timestamp;
      } else if (log.event === 'OUT' && currentInTime) {
        const inTime = new Date(currentInTime);
        const outTime = new Date(log.timestamp);
        const duration = Math.floor((outTime.getTime() - inTime.getTime()) / (1000 * 60));
        
        segments.push({
          inTime: currentInTime,
          outTime: log.timestamp,
          duration,
        });
        
        totalMinutes += duration;
        currentInTime = null;
      }
    }
    
    // Handle case where last event is IN (not clocked out yet)
    if (currentInTime) {
      const now = new Date();
      const inTime = new Date(currentInTime);
      const duration = Math.floor((now.getTime() - inTime.getTime()) / (1000 * 60));
      
      segments.push({
        inTime: currentInTime,
        outTime: null,
        duration,
      });
      
      totalMinutes += duration;
    }
    
    return { segments, allEvents, totalMinutes };
  };

  const processAttendanceLogs = (logs: AttendanceLog[], startDate: Date, endDate: Date): DayAttendance[] => {
    const dayMap = new Map<string, AttendanceLog[]>();
    
    logs.forEach(log => {
      const date = new Date(log.timestamp);
      // Use local date to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, []);
      }
      dayMap.get(dateKey)!.push(log);
    });

    const result: DayAttendance[] = [];
    
    // If it's a month view, iterate from end to start (most recent first)
    // If it's 30 days, iterate from today backwards
    const isMonthView = selectedPeriod !== '30 DAYS';
    
    if (isMonthView) {
      // For month view, iterate through all days in the month from last to first (descending)
      const lastDayOfMonth = endDate.getDate();
      
      for (let day = lastDayOfMonth; day >= 1; day--) {
        const date = new Date(startDate.getFullYear(), startDate.getMonth(), day);
        date.setHours(0, 0, 0, 0);
        
        // Use local date to avoid timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dayStr = String(date.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${dayStr}`;
        const dayLogs = dayMap.get(dateKey) || [];
        
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      if (isWeekend) {
        result.push({
          date: dateKey,
          grossHours: 'Full day Weekly-off',
          arrival: '',
          arrivalStatus: null,
          logStatus: 'pending',
          attendanceVisual: null,
        });
      } else if (dayLogs.length > 0) {
        const { segments, allEvents, totalMinutes } = processClockEvents(dayLogs);
        
        // Calculate gross hours from total minutes
        const hoursInt = Math.floor(totalMinutes / 60);
        const minutesInt = totalMinutes % 60;
        const grossHours = totalMinutes > 0 ? `${hoursInt}h ${minutesInt}m` : '0h 0m +';
        
        // Get first IN log for arrival calculation
        const firstInLog = dayLogs.find(log => log.event === 'IN');
        let arrival = 'On Time';
        let arrivalStatus: 'on-time' | 'late' | null = 'on-time';
        
        if (firstInLog) {
          const inTime = new Date(firstInLog.timestamp);
          // Check if late (assuming shift starts at 9 AM)
          const shiftStart = new Date(inTime);
          shiftStart.setHours(9, 0, 0, 0);
          if (inTime > shiftStart) {
            const lateMinutes = Math.floor((inTime.getTime() - shiftStart.getTime()) / (1000 * 60));
            const lateHours = Math.floor(lateMinutes / 60);
            const lateMins = lateMinutes % 60;
            arrival = `${lateHours}:${String(lateMins).padStart(2, '0')}:${String(Math.floor((lateMinutes % 1) * 60)).padStart(2, '0')} late`;
            arrivalStatus = 'late';
          }
        }
        
        // Determine log status
        const hasUnclosedIn = segments.some(s => s.outTime === null);
        const logStatus = segments.length > 0 && !hasUnclosedIn ? 'success' : hasUnclosedIn ? 'warning' : 'pending';
        
        result.push({
          date: dateKey,
          grossHours,
          arrival,
          arrivalStatus,
          logStatus,
          attendanceVisual: {
            hasData: true,
            segments,
            allEvents,
          },
        });
      } else {
        result.push({
          date: dateKey,
          grossHours: '0h 0m',
          arrival: '',
          arrivalStatus: null,
          logStatus: 'pending',
          attendanceVisual: null,
        });
      }
      }
    } else {
      // For 30 days view, show from today backwards (today + 29 previous days = 30 days total)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Show exactly 30 days: today (i=0) through 29 days ago (i=29)
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Use local date to avoid timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        const dayLogs = dayMap.get(dateKey) || [];
        
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        if (isWeekend) {
          result.push({
            date: dateKey,
            grossHours: 'Full day Weekly-off',
            arrival: '',
            arrivalStatus: null,
            logStatus: 'pending',
            attendanceVisual: null,
          });
        } else if (dayLogs.length > 0) {
          const { segments, allEvents, totalMinutes } = processClockEvents(dayLogs);
          
          // Calculate gross hours from total minutes
          const hoursInt = Math.floor(totalMinutes / 60);
          const minutesInt = totalMinutes % 60;
          const grossHours = totalMinutes > 0 ? `${hoursInt}h ${minutesInt}m` : '0h 0m +';
          
          // Get first IN log for arrival calculation
          const firstInLog = dayLogs.find(log => log.event === 'IN');
          let arrival = 'On Time';
          let arrivalStatus: 'on-time' | 'late' | null = 'on-time';
          
          if (firstInLog) {
            const inTime = new Date(firstInLog.timestamp);
            // Check if late (assuming shift starts at 9 AM)
            const shiftStart = new Date(inTime);
            shiftStart.setHours(9, 0, 0, 0);
            if (inTime > shiftStart) {
              const lateMinutes = Math.floor((inTime.getTime() - shiftStart.getTime()) / (1000 * 60));
              const lateHours = Math.floor(lateMinutes / 60);
              const lateMins = lateMinutes % 60;
              arrival = `${lateHours}:${String(lateMins).padStart(2, '0')}:${String(Math.floor((lateMinutes % 1) * 60)).padStart(2, '0')} late`;
              arrivalStatus = 'late';
            }
          }
          
          // Determine log status
          const hasUnclosedIn = segments.some(s => s.outTime === null);
          const logStatus = segments.length > 0 && !hasUnclosedIn ? 'success' : hasUnclosedIn ? 'warning' : 'pending';
          
          result.push({
            date: dateKey,
            grossHours,
            arrival,
            arrivalStatus,
            logStatus,
            attendanceVisual: {
              hasData: true,
              segments,
              allEvents,
            },
          });
        } else {
          result.push({
            date: dateKey,
            grossHours: '0h 0m',
            arrival: '',
            arrivalStatus: null,
            logStatus: 'pending',
            attendanceVisual: null,
          });
        }
      }
    }
    
    // Return with most recent first
    return result;
  };

  const handleClockInOut = async () => {
    if (!currentEmployeeId) return;
    
    try {
      setActionLoading(true);
      setError(null);

      // Capture timestamp from frontend
      const timestamp = new Date().toISOString();

      // Get user's current location with full address details
      const locationAddress = await getCurrentLocationWithAddress();

      if (attendanceStatus === 'IN') {
        // Clock out
        await attendanceService.clockOut({
          employeeId: currentEmployeeId,
          timestamp,
          locationAddress: locationAddress || undefined,
        });
        setAttendanceStatus('OUT');
        showSuccess('Clocked out successfully!');
      } else {
        // Clock in
        await attendanceService.clockIn({
          employeeId: currentEmployeeId,
          timestamp,
          locationAddress: locationAddress || undefined,
        });
        setAttendanceStatus('IN');
        showSuccess('Clocked in successfully!');
      }

      loadAttendanceData();
    } catch (err: any) {
      const errorMessage = err.message || `Failed to clock ${attendanceStatus === 'IN' ? 'out' : 'in'}`;
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (date: Date, is24Hour: boolean = false) => {
    if (is24Hour) {
      return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    return date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatShiftTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatTimestampForTooltip = (timestamp: string | undefined): string => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const calculateShiftProgress = () => {
    if (!currentShift) return 0;
    
    const now = new Date();
    const [startHour, startMin] = currentShift.startTime.split(':').map(Number);
    const [endHour, endMin] = currentShift.endTime.split(':').map(Number);
    
    const startTime = new Date(now);
    startTime.setHours(startHour, startMin, 0, 0);
    
    const endTime = new Date(now);
    endTime.setHours(endHour, endMin, 0, 0);
    
    if (now < startTime) return 0;
    if (now > endTime) return 100;
    
    const total = endTime.getTime() - startTime.getTime();
    const elapsed = now.getTime() - startTime.getTime();
    return (elapsed / total) * 100;
  };

  const calculateDuration = () => {
    if (!currentShift) return '0h 0m';
    const [startHour, startMin] = currentShift.startTime.split(':').map(Number);
    const [endHour, endMin] = currentShift.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const durationMinutes = endMinutes - startMinutes;
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
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

  if (loading && attendanceLogs.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Top Section: Stats, Timings, Actions */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Attendance Stats */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Attendance Stats
                </Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={statsPeriod}
                    onChange={(e) => setStatsPeriod(e.target.value)}
                    sx={{ height: 32 }}
                  >
                    <MenuItem value="lastWeek">Last Week</MenuItem>
                    <MenuItem value="lastMonth">Last Month</MenuItem>
                    <MenuItem value="lastQuarter">Last Quarter</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Me Stats */}
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <PersonIcon sx={{ color: '#ffa726', fontSize: 28 }} />
                  <Typography variant="body2" fontWeight="bold">
                    Me
              </Typography>
            </Box>
                <Box sx={{ ml: 4 }}>
                  <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      AVG HRS / DAY
                    </Typography>
                    <Tooltip title="Average hours per day">
                      <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    </Tooltip>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    {myStats.avgHoursPerDay}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    ON TIME ARRIVAL
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {myStats.onTimeArrival}%
                  </Typography>
            </Box>
          </Box>

              {/* My Team Stats */}
              <Box>
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <GroupsIcon sx={{ color: '#42a5f5', fontSize: 28 }} />
                  <Typography variant="body2" fontWeight="bold">
                    My Team
                  </Typography>
                </Box>
                <Box sx={{ ml: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    AVG HRS / DAY
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    {teamStats.avgHoursPerDay}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    ON TIME ARRIVAL
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {teamStats.onTimeArrival}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
              </Grid>

        {/* Timings */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Timings
              </Typography>

              {/* Day Selector */}
              <Box display="flex" gap={1} sx={{ mb: 2 }}>
                {dayAbbreviations.map((day, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backgroundColor: selectedDay === index ? '#26a69a' : 'transparent',
                      color: selectedDay === index ? 'white' : 'text.primary',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: selectedDay === index ? '#26a69a' : 'action.hover',
                      },
                    }}
                      >
                        {day}
                  </Box>
                ))}
              </Box>

              {currentShift && (
                <>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Today ({formatShiftTime(currentShift.startTime)} - {formatShiftTime(currentShift.endTime)})
                  </Typography>
                  
                  <LinearProgress
                    variant="determinate"
                    value={calculateShiftProgress()}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e0e0e0',
                      mb: 1,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#26a69a',
                      },
                    }}
                  />
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Duration: {calculateDuration()}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <CoffeeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {Math.floor(currentShift.breakDuration * 60)} min
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
                </Grid>

        {/* Actions */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Actions
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={is24HourFormat}
                      onChange={(e) => setIs24HourFormat(e.target.checked)}
                    />
                  }
                  label={<Typography variant="caption">24 hour format</Typography>}
                />
              </Box>

              <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                {formatTime(currentTime, is24HourFormat)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {formatDate(currentTime)}
              </Typography>

              <Button
                variant="contained"
                color={attendanceStatus === 'IN' ? 'error' : 'success'}
                fullWidth
                onClick={handleClockInOut}
                disabled={actionLoading}
                sx={{ mb: 2, py: 1.5 }}
              >
                {actionLoading ? (
                  <CircularProgress size={24} />
                ) : attendanceStatus === 'IN' ? (
                  'Web Clock-out'
                ) : (
                  'Web Clock-in'
                )}
              </Button>

              <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  TOTAL HOURS
                </Typography>
                <Tooltip title="Total hours worked">
                  <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                </Tooltip>
              </Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Effective: {effectiveHours}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Gross: {grossHours}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {timeSinceLogin} Since Last Login
              </Typography>

              <Box display="flex" flexDirection="column" gap={0.5}>
                <Button variant="text" size="small" sx={{ justifyContent: 'flex-start', textTransform: 'none' }}>
                  Partial Day Request
                </Button>
                <Button variant="text" size="small" sx={{ justifyContent: 'flex-start', textTransform: 'none' }}>
                  Attendance Policy
                </Button>
              </Box>
        </CardContent>
      </Card>
        </Grid>
      </Grid>

      {/* Logs & Requests Section */}
      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(_e, newValue) => setActiveTab(newValue)}>
              <Tab
                label="Attendance Log"
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTab === 0 ? 'bold' : 'normal',
                  color: activeTab === 0 ? 'primary.main' : 'text.secondary',
                }}
              />
              <Tab
                label="Calendar"
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTab === 1 ? 'bold' : 'normal',
                  color: activeTab === 1 ? 'primary.main' : 'text.secondary',
                }}
              />
              <Tab
                label="Attendance Requests"
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTab === 2 ? 'bold' : 'normal',
                  color: activeTab === 2 ? 'primary.main' : 'text.secondary',
                }}
              />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {selectedPeriod === '30 DAYS' ? 'Last 30 Days' : selectedPeriod}
            </Typography>
                <Box display="flex" gap={1}>
                  {['30 DAYS', ...monthNames.slice(-6).reverse()].map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? 'contained' : 'outlined'}
                            size="small"
                      onClick={() => setSelectedPeriod(period)}
                      sx={{
                        minWidth: 'auto',
                        px: 1.5,
                        textTransform: 'none',
                        backgroundColor: selectedPeriod === period ? 'primary.main' : 'transparent',
                        color: selectedPeriod === period ? 'white' : 'text.primary',
                      }}
                    >
                      {period}
                    </Button>
                  ))}
                </Box>
                        </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography variant="body2" fontWeight="bold">DATE</Typography></TableCell>
                      <TableCell><Typography variant="body2" fontWeight="bold">ATTENDANCE VISUAL</Typography></TableCell>
                      <TableCell><Typography variant="body2" fontWeight="bold">GROSS HOURS</Typography></TableCell>
                      <TableCell><Typography variant="body2" fontWeight="bold">ARRIVAL</Typography></TableCell>
                      <TableCell><Typography variant="body2" fontWeight="bold">LOG</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceLogs.map((day) => {
                      const date = new Date(day.date);
                      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
                      const dayNum = date.getDate();
                      const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
                      
                      const isWeeklyOff = day.grossHours === 'Full day Weekly-off';
                      
                      return (
                        <TableRow 
                          key={day.date}
                          sx={{
                            backgroundColor: isWeeklyOff ? '#c2b89d33' : 'transparent',
                            '&:hover': {
                              backgroundColor: isWeeklyOff ? '#eeeeee' : 'action.hover',
                            },
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" sx={{ color: isWeeklyOff ? 'text.secondary' : 'text.primary' }}>
                              {dayName}, {String(dayNum).padStart(2, '0')} {monthName}
                          </Typography>
                          </TableCell>
                          <TableCell>
                            {day.attendanceVisual?.hasData ? (
                              <Box display="flex" alignItems="center" gap={1}>
                                <Box
                                  sx={{
                                    width: 200,
                                    height: 20,
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: 1,
                                    position: 'relative',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {(() => {
                                    if (!day.attendanceVisual) return null;
                                    
                                    const attendanceVisual = day.attendanceVisual;
                                    
                                    // Calculate total duration for the day (assuming 24 hours = 100%)
                                    const dayStart = new Date(day.date);
                                    dayStart.setHours(0, 0, 0, 0);
                                    const dayEnd = new Date(day.date);
                                    dayEnd.setHours(23, 59, 59, 999);
                                    const totalDayMinutes = (dayEnd.getTime() - dayStart.getTime()) / (1000 * 60);
                                    
                                    return attendanceVisual.segments.map((segment, index) => {
                                      const segmentStart = new Date(segment.inTime);
                                      
                                      // Calculate position and width as percentage of the day
                                      const startMinutes = (segmentStart.getTime() - dayStart.getTime()) / (1000 * 60);
                                      const segmentMinutes = segment.duration;
                                      
                                      const leftPercent = (startMinutes / totalDayMinutes) * 100;
                                      const widthPercent = (segmentMinutes / totalDayMinutes) * 100;
                                      const segmentsLength = attendanceVisual.segments.length;
                                      
                                      return (
                                        <Tooltip
                                          key={index}
                                          title={
                                            <Box>
                                              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                                                Session {index + 1}
                                              </Typography>
                                              <Typography variant="body2">
                                                Clock In: {formatTimestampForTooltip(segment.inTime)}
                                              </Typography>
                                              {segment.outTime ? (
                                                <Typography variant="body2">
                                                  Clock Out: {formatTimestampForTooltip(segment.outTime)}
                                                </Typography>
                                              ) : (
                                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                  Clock Out: Not yet clocked out
                                                </Typography>
                                              )}
                                              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                                                Duration: {Math.floor(segment.duration / 60)}h {segment.duration % 60}m
                                              </Typography>
                                            </Box>
                                          }
                                          arrow
                                          placement="top"
                                        >
                                          <Box
                                            sx={{
                                              position: 'absolute',
                                              left: `${Math.max(0, Math.min(100, leftPercent))}%`,
                                              width: `${Math.max(1, Math.min(100, widthPercent))}%`,
                                              height: '100%',
                                              backgroundColor: segment.outTime ? '#26a69a' : '#ff9800',
                                              borderRadius: index === 0 ? '4px 0 0 4px' : index === segmentsLength - 1 ? '0 4px 4px 0' : '0',
                                              borderRight: index < segmentsLength - 1 ? '1px solid #fff' : 'none',
                                              cursor: 'help',
                                              '&:hover': {
                                                opacity: 0.8,
                                                zIndex: 1,
                                              },
                                            }}
                                          />
                                        </Tooltip>
                                      );
                                    });
                                  })()}
                                </Box>
                                <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                              </Box>
                            ) : (
                              <Box sx={{ width: 200, height: 20 }} />
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: isWeeklyOff ? 'text.secondary' : 'text.primary' }}>
                              {day.grossHours}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {day.arrivalStatus === 'on-time' && (
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                                <Typography variant="body2">{day.arrival}</Typography>
                              </Box>
                            )}
                            {day.arrivalStatus === 'late' && (
                              <Typography variant="body2" color="warning.main">
                                {day.arrival}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {day.logStatus === 'success' && (
                              <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                            )}
                            {day.logStatus === 'warning' && (
                              <WarningIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                            )}
                            {day.logStatus === 'pending' && (
                              <MoreVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {activeTab === 1 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Calendar view coming soon
              </Typography>
                        </Box>
          )}

          {activeTab === 2 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Attendance requests coming soon
              </Typography>
                </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
