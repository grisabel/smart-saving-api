import { HabitResponseDto } from '@infrastructure/modules/FinancialControl/infrastructure/dtos/response/HabitResponseDto';
import { Habit, HabitsType } from './models/Habit';
import { Email } from '@domain/models/Email';

export interface HabitInterfaceRepository {
  create(habit: Habit): Promise<void>;
  read(email: Email, type: HabitsType): Promise<HabitResponseDto>;
  delete(email: Email, type: HabitsType): Promise<void>;
}
