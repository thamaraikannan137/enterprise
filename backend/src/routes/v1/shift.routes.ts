import { Router } from 'express';
import shiftController from '../../controllers/shift.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';

const router = Router();

router.use(authenticate);

router.post('/', shiftController.createShift.bind(shiftController));
router.get('/', shiftController.getShifts.bind(shiftController));
router.get('/:id', shiftController.getShiftById.bind(shiftController));
router.put('/:id', shiftController.updateShift.bind(shiftController));
router.delete('/:id', shiftController.deleteShift.bind(shiftController));

export default router;

