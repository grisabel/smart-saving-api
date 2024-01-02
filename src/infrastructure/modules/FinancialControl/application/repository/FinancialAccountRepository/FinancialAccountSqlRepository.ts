import { prisma } from '@application/repository/db';
import { FinancialAccountInterfaceRepository } from './FinancialAccountInterfaceRepository';
import { FinancialAccountSummary } from './models/FinancialAccountSummary';
import { Email } from '@domain/models/Email';

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
  summary(email: Email, accountId: number): Promise<FinancialAccountSummary> {
    return Promise.resolve({expenses: 10.59, incomes: 5.25})
  }
}
