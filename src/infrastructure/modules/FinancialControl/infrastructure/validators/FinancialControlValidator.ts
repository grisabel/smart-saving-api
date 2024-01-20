import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import {
  Body,
  Param,
  Query,
} from '@infrastructure/middlewares/validators/body';

const addConcept = [Body('concept').required()];

const getAccountSummary = [
  Param('accountNumber').financialAccount().required(),
  Param('year').date({ format: DATE_FORMATS.Year }).optional(),
];

const deleteConcept = [Param('conceptId').concept().required()];

const addTransaction = [
  Param('accountNumber').financialAccount().required(),
  Body('conceptId').concept().required(),
  Body('amount').required().isNumeric(),
  Body('date').date().required(),
  Body('note').required(),
];

const reports = [
  Param('accountNumber').financialAccount().required(),
  Query('dateTo').date().required(),
  Query('dateFrom').date().required().isDateEarlier('dateTo'),
];

export default {
  addConcept,
  getAccountSummary,
  deleteConcept,
  addTransaction,
  reports,
};
