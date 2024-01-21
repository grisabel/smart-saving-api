import { prisma } from '@application/repository/db';
import { HabitInterfaceRepository } from './HabitInterfaceRepository';
import { Habit, HabitsType } from './models/Habit';
import { Email } from '@domain/models/Email';
import { HabitResponseDto } from '@infrastructure/modules/FinancialControl/infrastructure/dtos/response/HabitResponseDto';
import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import { Id } from '@domain/models/Id/Id';
import { HabitsType as HabitsTypePrisma } from '@prisma/client';
export class HabitSqlRepository implements HabitInterfaceRepository {
  create(habit: Habit): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.habits
        .create({
          data: {
            userEmail: habit.email,
            type: HabitsType[habit.type],
            transactionId: habit.transactionId,
          },
        })
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  read(email: Email, type: HabitsType): Promise<HabitResponseDto> {
    return new Promise((resolve, reject) => {
      prisma.habits
        .findMany({
          where: {
            userEmail: email.getValue(),
            type: HabitsTypePrisma[type],
          },
          select: {
            type: true,
            transaction: {
              select: {
                id: true,
                amount: true,
                date: true,
                note: true,
                conceptId: true,
                concept: true,
              },
            },
          },
        })
        .then((habits) => {
          if (habits.length <= 0) {
            resolve({
              type: type,
              transaction: null,
            });
          }

          const habit = habits[0];
          let conceptId = '';
          try {
            Id.createFrom(habit.transaction.conceptId);
            conceptId = habit.transaction.conceptId;
          } catch (error) {
            conceptId = habit.transaction.conceptId.split('_')[0];
          }

          resolve({
            type: HabitsType[habit.type],
            transaction: {
              transactionId: habit.transaction.id,
              amount: habit.transaction.amount,
              conceptId: conceptId,
              concept: habit.transaction.concept.concept,
              date: DateTimeService.parse(
                {
                  date: `${habit.transaction.date.getTime()}`,
                  format: DATE_FORMATS.TimestampMs,
                },
                DATE_FORMATS.Date
              ),
              note: habit.transaction.note,
            },
          });
        })
        .catch(() =>
          resolve({
            type: type,
            transaction: null,
          })
        );
    });
  }

  delete(email: Email, type: HabitsType): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.habits
        .deleteMany({
          where: {
            userEmail: email.getValue(),
            type: HabitsTypePrisma[type],
          },
        })
        .then(() => resolve())
        .catch(() => reject());
    });
  }
}
