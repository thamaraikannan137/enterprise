import { Router } from 'express';
import locationController from '../../controllers/location.controller.ts';
import { authenticate } from '../../middlewares/auth.middleware.ts';
import { validate } from '../../middlewares/validation.middleware.ts';
import { createLocationSchema, updateLocationSchema } from '../../validators/location.validator.ts';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validate(createLocationSchema), locationController.createLocation);
router.get('/', locationController.getAllLocations);
router.get('/:id', locationController.getLocationById);
router.put('/:id', validate(updateLocationSchema), locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

export default router;





