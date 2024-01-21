import { Habit } from './models/Habit';

export interface HabitInterfaceRepository {
  create(habit: Habit): Promise<void>;
}
