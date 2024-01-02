import { User } from '@domain/models/User';

import { ErrorResponseMapper } from '@infrastructure/mappers/response/ErrorResponseMapper';
import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';
import { FinancialAccountInterfaceRepository, FinancialAccountRepositoryError } from '@infrastructure/modules/FinancialControl/application/repository/FinancialAccountRepository/FinancialAccountInterfaceRepository';
import { FinancialAccountFactoryRepository } from '@FinancialControl/application/repository/FinancialAccountRepository/FinancialAccountFactoryRepository';
import { Email } from '@domain/models/Email';
import { FinancialAccountSummaryResponseDto } from '../../infrastructure/dtos/response/FinancialAccountSummaryResponseDto';

export class FinancialAccountUseCase {
  constructor(
    private financialAccount: FinancialAccountInterfaceRepository
  ) {}

  obtainSummary(email: Email, accountNumber: number): Promise<[ErrorResponseDto | Error, FinancialAccountSummaryResponseDto]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.financialAccount.summary(email, accountNumber);

        const resultDto: FinancialAccountSummaryResponseDto = {
            expenses: result.expenses,
            incomes: result.incomes
        }
        resolve([null, resultDto]);
      } catch (error) {
        if (error instanceof FinancialAccountRepositoryError) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            message: 'Cuenta no existente', //todo
            error,
          });

          resolve([errorDto, null]);
        }

        reject(error);
      }
    });
  }
}

export class FinancialAccountUseCaseFactory {
  static instance: FinancialAccountUseCase | null = null;

  static getIntance(): FinancialAccountUseCase {
    if (!FinancialAccountUseCaseFactory.instance) {
      const financialAccountRepository =
        FinancialAccountFactoryRepository.getInstance();
        
      FinancialAccountUseCaseFactory.instance = new FinancialAccountUseCase(
        financialAccountRepository
      );
    }
    return FinancialAccountUseCaseFactory.instance;
  }
}
