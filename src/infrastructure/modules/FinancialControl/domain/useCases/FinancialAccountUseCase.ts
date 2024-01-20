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
import { TransactionFactoryRepository } from '../../application/repository/TransactionRepository/TransactionFactoryRepository';
import { TransactionInterfaceRepository } from '../../application/repository/TransactionRepository/TransactionInterfaceRepository';
import { Transaction } from '../../application/repository/TransactionRepository/models/Transaction';
import AggregateData from '../../application/repository/TransactionRepository/utils/AggregateData';
import { DateTimeModel } from '@application/services/DateTimeService/DateTimeInterfaceService';
import { FinancialAccountReportsResponseDto } from '../../infrastructure/dtos/response/FinancialAccountReportsResponseDto';
import { FinancialAccountReportsDetailsResponseDto } from '../../infrastructure/dtos/response/FinancialAccountReportsDetailsResponseDto';

export class FinancialAccountUseCase {
  constructor(
    private financialAccount: FinancialAccountInterfaceRepository,
    private conceptRepository: ConceptInterfaceRepository,
    private transactionRepository: TransactionInterfaceRepository
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
            message: 'Concepto Duplicado',
            error,
          });

          resolve([errorDto, null]);
          return;
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

  addTransaction(
    email: Email,
    accountNumber: number,
    transaction: Transaction,
    type: 'income' | 'expense'
  ): Promise<[ErrorResponseDto | Error, FinancialAccountConceptResponseDto]> {
    return new Promise(async (resolve, reject) => {
      try {
        let result;

        if (type === 'expense') {
          result = await this.transactionRepository.addExpense(
            email,
            accountNumber,
            transaction
          );
        } else {
          result = await this.transactionRepository.addIncome(
            email,
            accountNumber,
            transaction
          );
        }

        resolve([null, null]);
      } catch (error) {
        reject(error);
      }
    });
  }

  obtainSummary(
    email: Email,
    accountNumber: number,
    year: DateTimeModel
  ): Promise<[ErrorResponseDto | Error, FinancialAccountSummaryResponseDto]> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.financialAccount.summary(
          email,
          accountNumber,
          year
        );

        const expensesDefault = AggregateData.byMonthDefault(year);
        const incomesDefault = AggregateData.byMonthDefault(year);
        const expensesValue = AggregateData.byMonth(result.expenses);
        const incomesValue = AggregateData.byMonth(result.incomes);

        const resultDto: FinancialAccountSummaryResponseDto = {
          expenses: expensesDefault.map((expensesDft, i) => {
            if (expensesValue[i]) {
              return expensesValue[i];
            }
            return expensesDft;
          }),
          incomes: incomesDefault.map((incomesDft, i) => {
            if (incomesValue[i]) {
              return incomesValue[i];
            }
            return incomesDft;
          }),
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

  obtainReports(
    email: Email,
    accountNumber: number,
    dateTo: DateTimeModel,
    dateFrom: DateTimeModel,
    type: 'income' | 'expense'
  ): Promise<[ErrorResponseDto | Error, FinancialAccountReportsResponseDto]> {
    return new Promise(async (resolve, reject) => {
      try {
        let result;

        if (type === 'expense') {
          result = await this.financialAccount.reportsExpense(
            email,
            accountNumber,
            dateTo,
            dateFrom
          );
        } else {
          result = await this.financialAccount.reportsIncome(
            email,
            accountNumber,
            dateTo,
            dateFrom
          );
        }

        const resultDto = AggregateData.byCategory(result);
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

  obtainReportsDetails(
    email: Email,
    accountNumber: number,
    conceptId: string,
    dateTo: DateTimeModel,
    dateFrom: DateTimeModel,
    type: 'income' | 'expense'
  ): Promise<
    [ErrorResponseDto | Error, FinancialAccountReportsDetailsResponseDto]
  > {
    return new Promise(async (resolve, reject) => {
      try {
        let resultDto;

        if (type === 'expense') {
          resultDto = await this.financialAccount.reportsExpenseDetails(
            email,
            accountNumber,
            conceptId,
            dateTo,
            dateFrom
          );
        } else {
          resultDto = await this.financialAccount.reportsIncomeDetails(
            email,
            accountNumber,
            conceptId,
            dateTo,
            dateFrom
          );
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

      const conceptRepository = ConceptFactoryRepository.getInstance();

      const transactionRepository = TransactionFactoryRepository.getInstance();

      FinancialAccountUseCaseFactory.instance = new FinancialAccountUseCase(
        financialAccountRepository,
        conceptRepository,
        transactionRepository
      );
    }
    return FinancialAccountUseCaseFactory.instance;
  }
}
