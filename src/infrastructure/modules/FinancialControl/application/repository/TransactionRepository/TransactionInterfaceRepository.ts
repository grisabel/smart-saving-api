import { Transaction } from './models/Transaction';

export interface TransactionInterfaceRepository {
  addExpense(accountNumber: string, expense: Transaction): Promise<void>;
  addIncome(accountNumber: string, income: Transaction): Promise<void>;
}
