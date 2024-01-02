import { Param } from "@infrastructure/middlewares/validators/body";

const getAccountSummary = [
  Param('accountNumber').financialAccount().required(),
];


export default {
  getAccountSummary
};
