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

router.post(
  '/accounts/:accountNumber/income',
  FinancialControlValidator.addTransaction,
  validate,
  isLoggedIn,
  FinancialControlController.addIncome
);

router.post(
  '/accounts/:accountNumber/expense',
  FinancialControlValidator.addTransaction,
  validate,
  isLoggedIn,
  FinancialControlController.addExpense
);

router.get(
  '/accounts/:accountNumber/summary/:year?',
  FinancialControlValidator.getAccountSummary,
  validate,
  isLoggedIn,
  FinancialControlController.obtainAccountSummary
);

router.get(
  '/accounts/:accountNumber/reports/income',
  FinancialControlValidator.reports,
  validate,
  isLoggedIn,
  FinancialControlController.obtainIncomeReport
);

router.get(
  '/accounts/:accountNumber/reports/expense',
  FinancialControlValidator.reports,
  validate,
  isLoggedIn,
  FinancialControlController.obtainExpenseReport
);

router.get(
  '/accounts/:accountNumber/reports/income/:conceptId',
  FinancialControlValidator.reportsDetails,
  validate,
  isLoggedIn,
  FinancialControlController.obtainIncomeReportDetails
);

router.get(
  '/accounts/:accountNumber/reports/expense/:conceptId',
  FinancialControlValidator.reportsDetails,
  validate,
  isLoggedIn,
  FinancialControlController.obtainExpenseReportDetails
);

router.get(
  '/habits/alimentation',
  isLoggedIn,
  FinancialControlController.obtainAlimentationHabits
);

router.get(
  '/habits/vehicle',
  isLoggedIn,
  FinancialControlController.obtainAlimentationHabits
);

router.get(
  '/habits/restaurant',
  isLoggedIn,
  FinancialControlController.obtainAlimentationHabits
);

router.get(
  '/habits/ant-expenses',
  isLoggedIn,
  FinancialControlController.obtainAlimentationHabits
);

export default router;
