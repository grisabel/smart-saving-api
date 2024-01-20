import { Email } from '@domain/models/Email';
import { FinancialAccountSummary } from './models/FinancialAccountSummary';
import { DateTimeModel } from '@application/services/DateTimeService/DateTimeInterfaceService';
import { Transaction } from '../TransactionRepository/models/Transaction';

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
  summary(
    email: Email,
    accountNumber: number,
    year: DateTimeModel
  ): Promise<FinancialAccountSummary>;
  reportsIncome(
    email: Email,
    accountNumber: number,
    dateTo: DateTimeModel,
    dateFrom: DateTimeModel
  ): Promise<Transaction[]>;
  reportsExpense(
    email: Email,
    accountNumber: number,
    dateTo: DateTimeModel,
    dateFrom: DateTimeModel
  ): Promise<Transaction[]>;
}
