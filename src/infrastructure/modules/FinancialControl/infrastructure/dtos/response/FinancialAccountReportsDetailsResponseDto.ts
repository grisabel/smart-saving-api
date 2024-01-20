export type FinancialAccountReportsDetailsResponseDto =
  ReportsDetailsResponseDto[];

export interface ReportsDetailsResponseDto {
  transactionId: string;
  conceptId: string;
  amount: number;
  date: string; // dd/MM/yyyy
  note: string;
}
