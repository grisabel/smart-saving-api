import { Email } from "@domain/models/Email";
import { FinancialAccountSummary } from "./models/FinancialAccountSummary";

//TODO review texts
export const FINANCIAL_ACCOUNT_REPOSITORY_ERROR = {
  accountNotExist: 'La cuenta no existe',
};
export interface FinancialAccountRepositoryErrorParams {
  accountNotExist?: string;
}

export class FinancialAccountRepositoryError extends Error {
  static msg: string = 'FinancialAccountRepositoryError';
  public data: FinancialAccountRepositoryErrorParams;

  constructor(data: FinancialAccountRepositoryErrorParams) {
    super(FinancialAccountRepositoryError.msg);
    this.data = data;
  }
}

export interface FinancialAccountInterfaceRepository {
  create(email: Email): Promise<void>;
  summary(email: Email, accountId: number): Promise<FinancialAccountSummary>;
}
