import { prisma } from '@application/repository/db';
import {
  FINANCIAL_ACCOUNT_REPOSITORY_ERROR,
  FinancialAccountInterfaceRepository,
  FinancialAccountRepositoryError,
} from './FinancialAccountInterfaceRepository';
import { FinancialAccountSummary } from './models/FinancialAccountSummary';
import { Email } from '@domain/models/Email';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DateTimeModel } from '@application/services/DateTimeService/DateTimeInterfaceService';
import { Transaction } from '../TransactionRepository/models/Transaction';
import { Id } from '@domain/models/Id/Id';
import { TransactionType } from '@prisma/client';

export class FinancialAccountSqlRepository
  implements FinancialAccountInterfaceRepository
{
  create(email: Email): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.financialAccount
        .create({ data: { userEmail: email.getValue() } })
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }
  summary(
    email: Email,
    accountNumber: number,
    year: DateTimeModel
  ): Promise<FinancialAccountSummary> {
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

        const _year = DateTimeService.parse(year, DATE_FORMATS.Year);

        const { dateStart, dateEnd } = {
          dateStart: {
            date: `01/01/${_year}`,
            format: DATE_FORMATS.Date,
          },
          dateEnd: {
            date: `31/12/${_year}`,
            format: DATE_FORMATS.Date,
          },
        };

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
            ],
          },
        });

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
            ],
          },
        });

        resolve({
          expenses: resulExpense.map((expense) => {
            return {
              transactionId: expense.id,
              amount: expense.amount,
              conceptId: expense.conceptId,
              date: DateTimeService.parse(
                {
                  date: `${expense.date.getTime()}`,
                  format: DATE_FORMATS.TimestampMs,
                },
                DATE_FORMATS.Date
              ),
              note: expense.note,
            };
          }),
          incomes: resulIncome.map((income) => {
            return {
              transactionId: income.id,
              amount: income.amount,
              conceptId: income.conceptId,
              date: DateTimeService.parse(
                {
                  date: `${income.date.getTime()}`,
                  format: DATE_FORMATS.TimestampMs,
                },
                DATE_FORMATS.Date
              ),
              note: income.note,
            };
          }),
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  reportsIncome(
    email: Email,
    accountNumber: number,
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
            amount: income.amount,
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
        reject(error);
      }
    });
  }
  reportsExpense(
    email: Email,
    accountNumber: number,
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
            amount: expense.amount,
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
        reject(error);
      }
    });
  }
  reportsIncomeDetails(
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
            amount: income.amount,
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
        reject(error);
      }
    });
  }
  reportsExpenseDetails(
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
            amount: expense.amount,
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
        reject(error);
      }
    });
  }
}
