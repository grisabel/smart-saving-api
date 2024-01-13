import { Body, Param } from '@infrastructure/middlewares/validators/body';

const addConcept = [Body('concept').required()];

const getAccountSummary = [
  Param('accountNumber').financialAccount().required(),
];

export default {
  addConcept,
  getAccountSummary,
};
