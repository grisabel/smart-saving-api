import { prisma } from '@application/repository/db';
import { HabitInterfaceRepository } from './HabitInterfaceRepository';
import { Habit } from './models/Habit';
import { HabitsType } from '@prisma/client';

export class HabitSqlRepository implements HabitInterfaceRepository {
  create(habit: Habit): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.habits
        .upsert({
          where: {
            id: `${HabitsType[habit.type]}_${habit.email}`,
          },
          update: {
            userEmail: habit.email,
            type: HabitsType[habit.type],
            transactionId: habit.transactionId,
          },
          create: {
            id: `${HabitsType[habit.type]}_${habit.email}`,
            userEmail: habit.email,
            type: HabitsType[habit.type],
            transactionId: habit.transactionId,
          },
        })
        .then(() => resolve())
        .catch(() => reject());
    });
  }
}
