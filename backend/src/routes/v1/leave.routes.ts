import { Router } from 'express';
import { leaveController } from '../../controllers/leave.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

// LeaveType routes
router.post('/types', leaveController.createLeaveType);
router.get('/types', leaveController.getAllLeaveTypes);
router.get('/types/:id', leaveController.getLeaveTypeById);
router.put('/types/:id', leaveController.updateLeaveType);
router.delete('/types/:id', leaveController.deleteLeaveType);

// EmployeeLeaveEntitlement routes
router.post('/entitlements', leaveController.createLeaveEntitlement);
router.get('/entitlements/employee/:employeeId', leaveController.getEmployeeLeaveEntitlements);
router.get('/entitlements/:id', leaveController.getLeaveEntitlementById);
router.put('/entitlements/:id', leaveController.updateLeaveEntitlement);
router.delete('/entitlements/:id', leaveController.deleteLeaveEntitlement);
router.post('/entitlements/initialize', leaveController.initializeLeaveEntitlements);

export default router;

