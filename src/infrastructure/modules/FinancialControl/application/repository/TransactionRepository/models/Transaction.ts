export interface Transaction {
  transactionId?: string;
  conceptId: string;
  amount: number;
  date: string; // dd/MM/yyyy
  note: string;
}
