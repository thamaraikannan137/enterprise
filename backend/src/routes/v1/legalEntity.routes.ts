import { Router } from 'express';
import legalEntityController from '../../controllers/legalEntity.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';
import { validate } from '../../middlewares/validation.middleware.ts';
import { createLegalEntitySchema, updateLegalEntitySchema } from '../../validators/legalEntity.validator.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validate(createLegalEntitySchema), legalEntityController.createLegalEntity);
router.get('/', legalEntityController.getAllLegalEntities);
router.get('/:id', legalEntityController.getLegalEntityById);
router.put('/:id', validate(updateLegalEntitySchema), legalEntityController.updateLegalEntity);
router.delete('/:id', legalEntityController.deleteLegalEntity);

export default router;




