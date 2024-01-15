import { Email } from '@domain/models/Email';
import { Transaction } from './models/Transaction';

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
}
