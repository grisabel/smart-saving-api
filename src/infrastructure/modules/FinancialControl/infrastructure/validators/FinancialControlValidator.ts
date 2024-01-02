import { Param } from "@infrastructure/middlewares/validators/body";

const getAccountSummary = [
  Param('accountId').financialAccount().required(),
];


export default {
  getAccountSummary
};
