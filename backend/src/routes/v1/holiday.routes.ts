import { Router } from 'express';
import holidayController from '../../controllers/holiday.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';

const router = Router();

router.use(authenticate);

router.post('/', holidayController.createHoliday.bind(holidayController));
router.get('/', holidayController.getHolidays.bind(holidayController));
router.get('/:id', holidayController.getHolidayById.bind(holidayController));
router.put('/:id', holidayController.updateHoliday.bind(holidayController));
router.delete('/:id', holidayController.deleteHoliday.bind(holidayController));

export default router;


