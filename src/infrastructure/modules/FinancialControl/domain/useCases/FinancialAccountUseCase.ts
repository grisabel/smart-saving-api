import { User } from '@domain/models/User';

import { ErrorResponseMapper } from '@infrastructure/mappers/response/ErrorResponseMapper';
import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';
import {
  FinancialAccountInterfaceRepository,
  FinancialAccountRepositoryError,
} from '@infrastructure/modules/FinancialControl/application/repository/FinancialAccountRepository/FinancialAccountInterfaceRepository';
import { FinancialAccountFactoryRepository } from '@FinancialControl/application/repository/FinancialAccountRepository/FinancialAccountFactoryRepository';
import { Email } from '@domain/models/Email';
import { FinancialAccountSummaryResponseDto } from '../../infrastructure/dtos/response/FinancialAccountSummaryResponseDto';
import {
  ConceptInterfaceRepository,
  ConceptRepositoryError,
} from '../../application/repository/ConceptRepository/ConceptInterfaceRepository';
import { ConceptFactoryRepository } from '../../application/repository/ConceptRepository/ConceptFactoryRepository';
import { FinancialAccountConceptListResponseDto } from '../../infrastructure/dtos/response/FinancialAccountConceptListResponseDto';
import { FinancialAccountConceptResponseDto } from '../../infrastructure/dtos/response/FinancialAccountConceptResponseDto';

export class FinancialAccountUseCase {
  constructor(
    private financialAccount: FinancialAccountInterfaceRepository,
    private conceptRepository: ConceptInterfaceRepository
  ) {}

  addConcept(
    email: Email,
    type: 'income' | 'expense',
    concept: string
  ): Promise<[ErrorResponseDto | Error, FinancialAccountConceptResponseDto]> {
    return new Promise(async (resolve, reject) => {
      try {
        let result;

        if (type === 'expense') {
          result = await this.conceptRepository.addExpense(email, concept);
        } else {
          result = await this.conceptRepository.addIncome(email, concept);
        }

        const resultDto: FinancialAccountConceptResponseDto = {
          id: result.id,
          concept: result.concept,
        };
        resolve([null, resultDto]);
      } catch (error) {
        if (error instanceof ConceptRepositoryError) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            message: error.message,
            error,
          });

          resolve([errorDto, null]);
        }
        reject(error);
      }
    });
  }

  obtainConcept(
    email: Email,
    type: 'income' | 'expense'
  ): Promise<
    [ErrorResponseDto | Error, FinancialAccountConceptListResponseDto]
  > {
    return new Promise(async (resolve, reject) => {
      try {
        let result;

        if (type === 'expense') {
          result = await this.conceptRepository.readAllExpense(email);
        } else {
          result = await this.conceptRepository.readAllIncome(email);
        }

        const resultDto: FinancialAccountConceptListResponseDto = result.map(
          (concept) => ({
            id: concept.id,
            concept: concept.concept,
          })
        );
        resolve([null, resultDto]);
      } catch (error) {
        const errorDto = ErrorResponseMapper.toResponseDto({
          message: 'Error al leer concepto en la cuenta del usuario', //todo
          error,
        });

        resolve([errorDto, null]);
      }
    });
  }

  deleteConcept(
    email: Email,
    type: 'income' | 'expense',
    conceptId: string
  ): Promise<[ErrorResponseDto | Error, null]> {
    return new Promise(async (resolve, reject) => {
      try {
        let result;

        if (type === 'expense') {
          result = await this.conceptRepository.deleteExpense(email, conceptId);
        } else {
          result = await this.conceptRepository.deleteIncome(email, conceptId);
        }

        resolve([null, null]);
      } catch (error) {
        if (error instanceof ConceptRepositoryError) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            message: 'El concepto no existe', //todo
            error,
          });

          resolve([errorDto, null]);
        }

        reject(error);
      }
    });
  }

  obtainSummary(
    email: Email,
    accountNumber: number
  ): Promise<[ErrorResponseDto | Error, FinancialAccountSummaryResponseDto]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.financialAccount.summary(
          email,
          accountNumber
        );

        const resultDto: FinancialAccountSummaryResponseDto = {
          expenses: result.expenses,
          incomes: result.incomes,
        };
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

      const conceptRepository = ConceptFactoryRepository.getInstance();

      FinancialAccountUseCaseFactory.instance = new FinancialAccountUseCase(
        financialAccountRepository,
        conceptRepository
      );
    }
    return FinancialAccountUseCaseFactory.instance;
  }
}
