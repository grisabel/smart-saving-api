import express from 'express';
import { validate } from '@infrastructure/middlewares/validators/validate';

import { isLoggedIn } from '@Session/infrastructure/middlewares/isLoggedIn/isLoggedIn';
import FinancialControlValidator from './validators/FinancialControlValidator';
import FinancialControlController from './controllers/FinancialControlController';

const router = express.Router();

router.get(
  '/concept/income',
  isLoggedIn,
  FinancialControlController.obtainConceptIncome
);

router.get(
  '/concept/expense',
  isLoggedIn,
  FinancialControlController.obtainConceptExpense
);

router.post(
  '/concept/income',
  FinancialControlValidator.addConcept,
  validate,
  isLoggedIn,
  FinancialControlController.addConceptIncome
);

router.post(
  '/concept/expense',
  FinancialControlValidator.addConcept,
  validate,
  isLoggedIn,
  FinancialControlController.addConceptExpense
);

router.delete(
  '/concept/income/:conceptId',
  FinancialControlValidator.deleteConcept,
  validate,
  isLoggedIn,
  FinancialControlController.deleteConceptIncome
);

router.delete(
  '/concept/expense/:conceptId',
  FinancialControlValidator.deleteConcept,
  validate,
  isLoggedIn,
  FinancialControlController.deleteConceptExpense
);

router.get(
  '/accounts/:accountNumber/summary',
  FinancialControlValidator.getAccountSummary,
  validate,
  isLoggedIn,
  FinancialControlController.obtainAccountSummary
);

export default router;
