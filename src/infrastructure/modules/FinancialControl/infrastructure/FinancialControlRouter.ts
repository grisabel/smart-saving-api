import express from 'express';
import { validate } from '@infrastructure/middlewares/validators/validate';

import { isLoggedIn } from '@Session/infrastructure/middlewares/isLoggedIn/isLoggedIn';
import UserController from '@Users/infrastructure/controllers/UserController';
import FinancialControlValidator from './validators/FinancialControlValidator';

const router = express.Router();

router.get(
  '/accounts/:accountId/summary',
  FinancialControlValidator.getAccountSummary,
  validate,
  isLoggedIn,
  UserController.deleteAccountConfirm //todo
);

export default router;
