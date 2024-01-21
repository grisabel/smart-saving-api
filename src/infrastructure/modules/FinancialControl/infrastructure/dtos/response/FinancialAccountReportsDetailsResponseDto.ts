import { Transaction } from '@infrastructure/modules/FinancialControl/application/repository/TransactionRepository/models/Transaction';

export type FinancialAccountReportsDetailsResponseDto =
  ReportsDetailsResponseDto[];

export type ReportsDetailsResponseDto = Required<Transaction>;
