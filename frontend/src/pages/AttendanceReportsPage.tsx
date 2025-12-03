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
  TextField,
  MenuItem,
} from '@mui/material';
import { attendanceService } from '../services/attendanceService';
import { employeeService } from '../services/employeeService';
import type { Employee } from '../types/employee';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export const AttendanceReportsPage = () => {
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string>('');
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      loadMonthlyReport();
    }
  }, [currentEmployeeId, selectedYear, selectedMonth]);

  const loadMonthlyReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await attendanceService.getMonthlyAttendance(
        currentEmployeeId,
        selectedYear,
        selectedMonth
      );

      setMonthlyData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load attendance report');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = () => {
    if (!monthlyData || !monthlyData.dailyStatus) {
      return { present: 0, partial: 0, absent: 0, totalHours: 0 };
    }

    let present = 0;
    let partial = 0;
    let absent = 0;
    let totalHours = 0;

    Object.values(monthlyData.dailyStatus).forEach((day: any) => {
      if (day.status === 'present') present++;
      else if (day.status === 'partial') partial++;
      else absent++;

      totalHours += parseFloat(day.totalHours || 0);
    });

    return { present, partial, absent, totalHours };
  };

  const handleExport = () => {
    // TODO: Implement export to Excel/PDF
    alert('Export functionality will be implemented soon');
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const summary = calculateSummary();
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
        <Typography variant="h4">Attendance Reports</Typography>
        {currentEmployee && (
          <Chip
            label={`${currentEmployee.first_name} ${currentEmployee.last_name}`}
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

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Year"
                fullWidth
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Month"
                fullWidth
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {monthNames.map((month, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
                fullWidth
              >
                Export Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CalendarMonthIcon color="primary" />
                <Typography variant="h6">Present Days</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {summary.present}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CalendarMonthIcon color="warning" />
                <Typography variant="h6">Partial Days</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {summary.partial}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CalendarMonthIcon color="error" />
                <Typography variant="h6">Absent Days</Typography>
              </Box>
              <Typography variant="h4" color="error.main">
                {summary.absent}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CalendarMonthIcon color="info" />
                <Typography variant="h6">Total Hours</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {summary.totalHours.toFixed(1)}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Daily Report Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Daily Attendance - {monthNames[selectedMonth - 1]} {selectedYear}
          </Typography>
          {monthlyData && monthlyData.dailyStatus ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Hours</TableCell>
                    <TableCell>Punches</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(monthlyData.dailyStatus)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, dayData]: [string, any]) => (
                      <TableRow key={date}>
                        <TableCell>
                          {new Date(date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={dayData.status}
                            color={
                              dayData.status === 'present'
                                ? 'success'
                                : dayData.status === 'partial'
                                ? 'warning'
                                : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{parseFloat(dayData.totalHours || 0).toFixed(1)}h</TableCell>
                        <TableCell>{dayData.punchCount || 0}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No attendance data available for this month.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};


