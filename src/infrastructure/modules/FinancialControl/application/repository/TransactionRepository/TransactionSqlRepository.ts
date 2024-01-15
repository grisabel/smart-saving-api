import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { TransactionInterfaceRepository } from './TransactionInterfaceRepository';
import { Transaction } from './models/Transaction';
import { prisma } from '@application/repository/db';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';

export class TransactionSqlRepository
  implements TransactionInterfaceRepository
{
  addExpense(accountNumber: string, expense: Transaction): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.income
        .create({
          data: {
            accountId: accountNumber,
            amount: expense.amount,
            date: DateTimeService.parse(
              {
                date: expense.date,
                format: DATE_FORMATS.Date,
              },
              DATE_FORMATS.TimestampMs
            ),
            note: expense.note,
            conceptId: expense.conceptId,
          },
        })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }
  addIncome(accountNumber: string, income: Transaction): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.income
        .create({
          data: {
            accountId: accountNumber,
            amount: income.amount,
            date: DateTimeService.parse(
              {
                date: income.date,
                format: DATE_FORMATS.Date,
              },
              DATE_FORMATS.TimestampMs
            ),
            note: income.note,
            conceptId: income.conceptId,
          },
        })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }
}
