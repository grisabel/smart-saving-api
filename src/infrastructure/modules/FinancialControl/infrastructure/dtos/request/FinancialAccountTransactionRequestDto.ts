export interface FinancialAccountTransactionRequestDto {
  concept: string;
  amount: number;
  date: string; //dd/MM/yyyy
  note: string;
  accountNumber: string;
}
