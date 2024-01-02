import express from 'express';
import { validate } from '@infrastructure/middlewares/validators/validate';

import { isLoggedIn } from '@Session/infrastructure/middlewares/isLoggedIn/isLoggedIn';
import FinancialControlValidator from './validators/FinancialControlValidator';
import FinancialControlController from './controllers/FinancialControlController';

const router = express.Router();

router.get(
  '/:accountId/summary',
  FinancialControlValidator.getAccountSummary,
  validate,
  isLoggedIn,
  FinancialControlController.obtainAccountSummary
);

export default router;
