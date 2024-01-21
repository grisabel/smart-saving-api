import { prisma } from '@application/repository/db';
import { HabitInterfaceRepository } from './HabitInterfaceRepository';
import { Habit } from './models/Habit';
import { HabitsType } from '@prisma/client';

export class HabitSqlRepository implements HabitInterfaceRepository {
  create(habit: Habit): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.habits
        .create({
          data: {
            transactionId: habit.transactionId,
            userEmail: habit.email,
            type: HabitsType[habit.type],
          },
        })
        .then(() => resolve())
        .catch(() => reject());
    });
  }
}
