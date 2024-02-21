export interface Transaction {
  transactionId?: string;
  conceptId: string;
  concept?: string;
  amount: number;
  date: string; // dd/MM/yyyy
  note: string;
}
