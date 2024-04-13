import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { TransactionInterfaceRepository } from './TransactionInterfaceRepository';
import { Transaction } from './models/Transaction';
import { DDBBConnectionError, prisma } from '@application/repository/db';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import { Email } from '@domain/models/Email';
import {
  FINANCIAL_ACCOUNT_REPOSITORY_ERROR,
  FinancialAccountRepositoryError,
} from '../FinancialAccountRepository/FinancialAccountInterfaceRepository';
import { Id } from '@domain/models/Id/Id';
import { DateTimeModel } from '@application/services/DateTimeService/DateTimeInterfaceService';
import { TransactionType } from '@prisma/client';

export class TransactionSqlRepository
  implements TransactionInterfaceRepository
{
  addExpense(
    email: Email,
    accountNumber: number,
    expense: Transaction
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const resulAccount = await prisma.financialAccount.findMany({
        where: { userEmail: email.getValue(), accountNumber },
      });

      if (resulAccount.length === 0) {
        const error = new FinancialAccountRepositoryError({
          accountNotExist: FINANCIAL_ACCOUNT_REPOSITORY_ERROR.accountNotExist,
        });
        reject(error);
      }

      let conceptId;
      try {
        Id.createFrom(expense.conceptId);
        conceptId = expense.conceptId;
      } catch (error) {
        conceptId = `${expense.conceptId}_${email.getValue()}`;
      }

      prisma.transaction
        .create({
          data: {
            type: TransactionType.Transaction_Expense,
            accountId: resulAccount[0].id,
            amount: parseFloat(expense.amount.toString()),
            date: DateTimeService.parse(
              {
                date: expense.date,
                format: DATE_FORMATS.Date,
              },
              DATE_FORMATS.ISO_8601
            ),
            note: expense.note,
            conceptId,
          },
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          if (error.name == 'PrismaClientInitializationError') {
            reject(new DDBBConnectionError());
            return;
          }
          reject(error);
        });
    });
  }
  addIncome(
    email: Email,
    accountNumber: number,
    income: Transaction
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const resulAccount = await prisma.financialAccount.findMany({
        where: { userEmail: email.getValue(), accountNumber },
      });

      if (resulAccount.length === 0) {
        const error = new FinancialAccountRepositoryError({
          accountNotExist: FINANCIAL_ACCOUNT_REPOSITORY_ERROR.accountNotExist,
        });
        reject(error);
      }

      let conceptId;
      try {
        Id.createFrom(income.conceptId);
        conceptId = income.conceptId;
      } catch (error) {
        conceptId = `${income.conceptId}_${email.getValue()}`;
      }

      prisma.transaction
        .create({
          data: {
            type: TransactionType.Transaction_Income,
            accountId: resulAccount[0].id,
            amount: parseFloat(income.amount.toString()),
            date: DateTimeService.parse(
              {
                date: income.date,
                format: DATE_FORMATS.Date,
              },
              DATE_FORMATS.ISO_8601
            ),
            note: income.note,
            conceptId,
          },
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          if (error.name == 'PrismaClientInitializationError') {
            reject(new DDBBConnectionError());
            return;
          }
          reject(error);
        });
    });
  }
  getExpenses(
    email: Email,
    accountNumber: number,
    conceptId: string,
    dateTo: DateTimeModel,
    dateFrom: DateTimeModel
  ): Promise<Transaction[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const resulAccount = await prisma.financialAccount.findMany({
          where: { userEmail: email.getValue(), accountNumber },
        });

        if (resulAccount.length === 0) {
          const error = new FinancialAccountRepositoryError({
            accountNotExist: FINANCIAL_ACCOUNT_REPOSITORY_ERROR.accountNotExist,
          });
          reject(error);
        }

        const dateStart = dateFrom;
        const dateEnd = dateTo;
        try {
          Id.createFrom(conceptId);
        } catch (error) {
          conceptId = `${conceptId}_${email.getValue()}`;
        }

        const resulExpense = await prisma.transaction.findMany({
          where: {
            AND: [
              { type: TransactionType.Transaction_Expense },
              { accountId: resulAccount[0].id },
              {
                date: {
                  gte: DateTimeService.parse(dateStart, DATE_FORMATS.ISO_8601),
                },
              },
              {
                date: {
                  lte: DateTimeService.parse(dateEnd, DATE_FORMATS.ISO_8601),
                },
              },
              { conceptId: conceptId },
            ],
          },
        });

        const expenses = resulExpense.map((expense) => {
          let conceptId = '';
          try {
            Id.createFrom(expense.conceptId);
            conceptId = expense.conceptId;
          } catch (error) {
            conceptId = expense.conceptId.split('_')[0];
          }

          return {
            transactionId: expense.id,
            amount: parseFloat(expense.amount.toString()),
            conceptId: conceptId,
            date: DateTimeService.parse(
              {
                date: `${expense.date.getTime()}`,
                format: DATE_FORMATS.TimestampMs,
              },
              DATE_FORMATS.Date
            ),
            note: expense.note,
          };
        });

        resolve(expenses);
      } catch (error) {
        if (error.name == 'PrismaClientInitializationError') {
          reject(new DDBBConnectionError());
          return;
        }
        reject(error);
      }
    });
  }
  getIncomes(
    email: Email,
    accountNumber: number,
    conceptId: string,
    dateTo: DateTimeModel,
    dateFrom: DateTimeModel
  ): Promise<Transaction[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const resulAccount = await prisma.financialAccount.findMany({
          where: { userEmail: email.getValue(), accountNumber },
        });

        if (resulAccount.length === 0) {
          const error = new FinancialAccountRepositoryError({
            accountNotExist: FINANCIAL_ACCOUNT_REPOSITORY_ERROR.accountNotExist,
          });
          reject(error);
        }

        const dateStart = dateFrom;
        const dateEnd = dateTo;
        try {
          Id.createFrom(conceptId);
        } catch (error) {
          conceptId = `${conceptId}_${email.getValue()}`;
        }

        const resulIncome = await prisma.transaction.findMany({
          where: {
            AND: [
              { type: TransactionType.Transaction_Income },
              { accountId: resulAccount[0].id },
              {
                date: {
                  gte: DateTimeService.parse(dateStart, DATE_FORMATS.ISO_8601),
                },
              },
              {
                date: {
                  lte: DateTimeService.parse(dateEnd, DATE_FORMATS.ISO_8601),
                },
              },
              { conceptId: conceptId },
            ],
          },
        });

        const incomes = resulIncome.map((income) => {
          let conceptId = '';
          try {
            Id.createFrom(income.conceptId);
            conceptId = income.conceptId;
          } catch (error) {
            conceptId = income.conceptId.split('_')[0];
          }

          return {
            transactionId: income.id,
            amount: parseFloat(income.amount.toString()),
            conceptId: conceptId,
            date: DateTimeService.parse(
              {
                date: `${income.date.getTime()}`,
                format: DATE_FORMATS.TimestampMs,
              },
              DATE_FORMATS.Date
            ),
            note: income.note,
          };
        });

        resolve(incomes);
      } catch (error) {
        if (error.name == 'PrismaClientInitializationError') {
          reject(new DDBBConnectionError());
          return;
        }
        reject(error);
      }
    });
  }
}
