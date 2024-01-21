import { HabitsType } from '@infrastructure/modules/FinancialControl/application/repository/HabitsRepository/models/Habit';
import { Transaction } from '@infrastructure/modules/FinancialControl/application/repository/TransactionRepository/models/Transaction';

export interface HabitResponseDto {
  type: HabitsType;
  transaction: Transaction | null;
}
