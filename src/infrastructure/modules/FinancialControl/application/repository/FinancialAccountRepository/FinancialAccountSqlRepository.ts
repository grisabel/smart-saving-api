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
    accountNumber: number
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

        const resulIncome = await prisma.income.findMany({
          where: { accountId: resulAccount[0].id },
        });

        const resulExpense = await prisma.expense.findMany({
          where: { accountId: resulAccount[0].id },
        });

        resolve({
          expenses: resulExpense.map((expense) => {
            return {
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
}
