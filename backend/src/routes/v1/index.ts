import { Router } from 'express';
import authRoutes from './auth.routes.ts';
import userRoutes from './user.routes.ts';
import employeeRoutes from './employee.routes.ts';
import employeeJobInfoRoutes from './employeeJobInfo.routes.ts';
import employeeDocumentRoutes from './employeeDocument.routes.ts';
import employeeCompensationRoutes from './employeeCompensation.routes.ts';
import allowanceRoutes from './allowance.routes.ts';
import deductionRoutes from './deduction.routes.ts';
import leaveRoutes from './leave.routes.ts';
import certificationRoutes from './certification.routes.ts';
import qualificationRoutes from './qualification.routes.ts';
import workPassRoutes from './workPass.routes.ts';
import auditRoutes from './audit.routes.ts';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/employees', employeeRoutes);
router.use('/employee-job-info', employeeJobInfoRoutes);
router.use('/employee-documents', employeeDocumentRoutes);
router.use('/employee-compensation', employeeCompensationRoutes);
router.use('/allowances', allowanceRoutes);
router.use('/deductions', deductionRoutes);
router.use('/leaves', leaveRoutes);
router.use('/certifications', certificationRoutes);
router.use('/qualifications', qualificationRoutes);
router.use('/work-passes', workPassRoutes);
router.use('/audit', auditRoutes);

export default router;
