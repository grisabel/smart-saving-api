import { Email } from '@domain/models/Email';
import { Transaction } from './models/Transaction';
import { DateTimeModel } from '@application/services/DateTimeService/DateTimeInterfaceService';

export interface TransactionInterfaceRepository {
  addExpense(
    email: Email,
    accountNumber: number,
    expense: Transaction
  ): Promise<void>;
  addIncome(
    email: Email,
    accountNumber: number,
    income: Transaction
  ): Promise<void>;
  getExpenses(
    email: Email,
    accountNumber: number,
    conceptId: string,
    dateTo: DateTimeModel,
    dateFrom: DateTimeModel
  ): Promise<Transaction[]>;
  getIncomes(
    email: Email,
    accountNumber: number,
    conceptId: string,
    dateTo: DateTimeModel,
    dateFrom: DateTimeModel
  ): Promise<Transaction[]>;
}
