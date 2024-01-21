import { prisma } from '@application/repository/db';
import { HabitInterfaceRepository } from './HabitInterfaceRepository';
import { Habit, HabitsType } from './models/Habit';
import { Email } from '@domain/models/Email';
import { HabitResponseDto } from '@infrastructure/modules/FinancialControl/infrastructure/dtos/response/HabitResponseDto';
import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import { Id } from '@domain/models/Id/Id';
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

  read(email: Email, type: HabitsType): Promise<HabitResponseDto> {
    return new Promise((resolve, reject) => {
      prisma.habits
        .findUnique({
          where: {
            id: `${HabitsType[type]}_${email.getValue()}`,
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
        .then((habit) => {
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
}
