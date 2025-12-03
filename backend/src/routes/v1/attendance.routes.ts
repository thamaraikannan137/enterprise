import { Router } from 'express';
import attendanceController from '../../controllers/attendance.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Clock in/out routes
router.post('/clock-in', attendanceController.clockIn.bind(attendanceController));
router.post('/clock-out', attendanceController.clockOut.bind(attendanceController));

// Get status and logs
router.get('/status/:employeeId', attendanceController.getCurrentStatus.bind(attendanceController));
router.get('/today/:employeeId', attendanceController.getTodayAttendance.bind(attendanceController));
router.get('/logs/:employeeId', attendanceController.getAttendanceLogs.bind(attendanceController));
router.get('/monthly/:employeeId', attendanceController.getMonthlyAttendance.bind(attendanceController));
router.get('/summary/:employeeId', attendanceController.getAttendanceSummary.bind(attendanceController));
router.get('/summary-range/:employeeId', attendanceController.getAttendanceSummaryRange.bind(attendanceController));

export default router;

