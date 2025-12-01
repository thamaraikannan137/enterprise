import { Router } from 'express';
import businessUnitController from '../../controllers/businessUnit.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';
import { validate } from '../../middlewares/validation.middleware.ts';
import { createBusinessUnitSchema, updateBusinessUnitSchema } from '../../validators/businessUnit.validator.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validate(createBusinessUnitSchema), businessUnitController.createBusinessUnit);
router.get('/', businessUnitController.getAllBusinessUnits);
router.get('/:id', businessUnitController.getBusinessUnitById);
router.put('/:id', validate(updateBusinessUnitSchema), businessUnitController.updateBusinessUnit);
router.delete('/:id', businessUnitController.deleteBusinessUnit);

export default router;




