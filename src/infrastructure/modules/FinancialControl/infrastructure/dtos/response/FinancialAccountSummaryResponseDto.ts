import { TransactionAggregateData } from '@infrastructure/modules/FinancialControl/application/repository/TransactionRepository/utils/AggregateData';

export interface FinancialAccountSummaryResponseDto {
  incomes: TransactionAggregateData[];
  expenses: TransactionAggregateData[];
}
