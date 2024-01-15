import { Body, Param } from '@infrastructure/middlewares/validators/body';

const addConcept = [Body('concept').required()];

const getAccountSummary = [
  Param('accountNumber').financialAccount().required(),
];

const deleteConcept = [Param('conceptId').id().required()];

const addTransaction = [
  Body('conceptId').id().required(),
  Body('amount').required().isNumeric(),
  Body('date').date().required(),
  Body('note').required(),
];

export default {
  addConcept,
  getAccountSummary,
  deleteConcept,
  addTransaction,
};
