import express from 'express';
import { validate } from '@infrastructure/middlewares/validators/validate';

import MarketingController from '@Marketing/infrastructure/controllers/MarketingController';
import MarketingValidator from '@Marketing/infrastructure/validators/MarketingValidator';

const router = express.Router();

router.post(
  '/contact-form',
  MarketingValidator.createContactForm,
  validate,
  MarketingController.createContactForm
);

export default router;
