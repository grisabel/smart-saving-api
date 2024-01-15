import { Transaction } from '../../TransactionRepository/models/Transaction';

export interface FinancialAccountSummary {
  incomes: Transaction[];
  expenses: Transaction[];
}
