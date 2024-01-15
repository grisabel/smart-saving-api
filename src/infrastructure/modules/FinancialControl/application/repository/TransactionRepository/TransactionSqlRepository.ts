import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { TransactionInterfaceRepository } from './TransactionInterfaceRepository';
import { Transaction } from './models/Transaction';
import { prisma } from '@application/repository/db';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import { Email } from '@domain/models/Email';
import {
  FINANCIAL_ACCOUNT_REPOSITORY_ERROR,
  FinancialAccountRepositoryError,
} from '../FinancialAccountRepository/FinancialAccountInterfaceRepository';

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
      prisma.expense
        .create({
          data: {
            accountId: resulAccount[0].id,
            amount: expense.amount,
            date: DateTimeService.parse(
              {
                date: expense.date,
                format: DATE_FORMATS.Date,
              },
              DATE_FORMATS.ISO_8601
            ),
            note: expense.note,
            conceptId: expense.conceptId,
          },
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
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
      prisma.income
        .create({
          data: {
            accountId: resulAccount[0].id,
            amount: income.amount,
            date: DateTimeService.parse(
              {
                date: income.date,
                format: DATE_FORMATS.Date,
              },
              DATE_FORMATS.ISO_8601
            ),
            note: income.note,
            conceptId: income.conceptId,
          },
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
