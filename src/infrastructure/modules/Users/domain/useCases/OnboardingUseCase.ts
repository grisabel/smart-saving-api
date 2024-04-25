import { Email } from '@domain/models/Email';
import { Password } from '@domain/models/Password';
import { User } from '@domain/models/User';
import { EmailError } from '@domain/models/Email/EmailError';
import { PasswordError } from '@domain/models/Password/PasswordError';

import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';
import {
  UserInterfaceRepository,
  UserRepositoryError,
} from '@application/repository/UserRepository/UserInterfaceRepository';

import { ErrorResponseMapper } from '@infrastructure/mappers/response/ErrorResponseMapper';
import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';
import { FinancialAccountInterfaceRepository } from '@infrastructure/modules/FinancialControl/application/repository/FinancialAccountRepository/FinancialAccountInterfaceRepository';
import { FinancialAccountFactoryRepository } from '@infrastructure/modules/FinancialControl/application/repository/FinancialAccountRepository/FinancialAccountFactoryRepository';
import { ConceptInterfaceRepository } from '@infrastructure/modules/FinancialControl/application/repository/ConceptRepository/ConceptInterfaceRepository';
import { ConceptFactoryRepository } from '@infrastructure/modules/FinancialControl/application/repository/ConceptRepository/ConceptFactoryRepository';
import {
  EmailService,
  EmailServiceFactory,
} from '@application/services/EmailService/EmailService';
import config from '@infrastructure/config';

export class OnboardingUseCase {
  constructor(
    private userRepository: UserInterfaceRepository,
    private financialAccount: FinancialAccountInterfaceRepository,
    private concept: ConceptInterfaceRepository,
    private emailService: EmailService,
  ) {}
  saveUser(user: User): Promise<[ErrorResponseDto | Error, null]> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.userRepository.save(user);
        await this.financialAccount.create(user.getEmail());
        await this.concept.addInitialData(user.getEmail());

        if (config.ENV !== 'E2E') {
          await this.emailService.sendWelcome(user.getEmail());
        }
        resolve([null, null]);
      } catch (error) {
        if (error instanceof UserRepositoryError) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            message: 'Usuario ya registrado', //todo
            error,
          });

          resolve([errorDto, null]);
        }

        reject(error);
      }
    });
  }
}

export class OnboardingUseCaseFactory {
  static instance: OnboardingUseCase | null = null;

  static getIntance(): OnboardingUseCase {
    if (!OnboardingUseCaseFactory.instance) {
      const userRepository = UserFactoryRepository.getInstance();
      const financialAccountRepository =
        FinancialAccountFactoryRepository.getInstance();

      const conceptRepository = ConceptFactoryRepository.getInstance();
      const emailService = EmailServiceFactory.getInstance();

      OnboardingUseCaseFactory.instance = new OnboardingUseCase(
        userRepository,
        financialAccountRepository,
        conceptRepository,
        emailService
      );
    }
    return OnboardingUseCaseFactory.instance;
  }
}
