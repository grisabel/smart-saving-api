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

export class OnboardingUseCase {
  constructor(private userRepository: UserInterfaceRepository) {}
  saveUser(user: User): Promise<[ErrorResponseDto | Error, null]> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.userRepository.save(user);
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
      OnboardingUseCaseFactory.instance = new OnboardingUseCase(userRepository);
    }
    return OnboardingUseCaseFactory.instance;
  }
}
