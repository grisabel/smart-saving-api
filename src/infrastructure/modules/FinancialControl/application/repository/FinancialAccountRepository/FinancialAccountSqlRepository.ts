import { prisma } from '@application/repository/db';
import { FINANCIAL_ACCOUNT_REPOSITORY_ERROR, FinancialAccountInterfaceRepository, FinancialAccountRepositoryError } from './FinancialAccountInterfaceRepository';
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
    return new Promise((resolve, reject) => {
      const error = new FinancialAccountRepositoryError({accountNotExist: FINANCIAL_ACCOUNT_REPOSITORY_ERROR.accountNotExist})
      reject(error)
    })
  }
}
