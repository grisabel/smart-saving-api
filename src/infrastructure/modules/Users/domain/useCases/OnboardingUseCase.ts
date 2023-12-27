import { Email } from '@domain/models/Email';
import { Password } from '@domain/models/Password';
import { User } from '@domain/models/User';
import { EmailError } from '@domain/models/Email/EmailError';
import { PasswordError } from '@domain/models/Password/PasswordError';

import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';
import { UserInterfaceRepository } from '@application/repository/UserRepository/UserInterfaceRepository';

import { ErrorResponseMapper } from '@infrastructure/mappers/response/ErrorResponseMapper';
import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';

import { OnboardingUserRequestDto } from '@Users/infrastructure/dtos/request/OnboardingUserRequestDto';

export class OnboardingUseCase {
  constructor(private userRepository: UserInterfaceRepository) {}
  saveUser(
    userDTO: OnboardingUserRequestDto
  ): Promise<[ErrorResponseDto | Error, null]> {
    return new Promise((resolve) => {
      try {
        const email = Email.createFromText(userDTO.email);
        const password = Password.createFromText(userDTO.password);
        const user = new User(
          email,
          userDTO.firstName,
          userDTO.lastName,
          userDTO.dateBirth,
          userDTO.objetive,
          userDTO.lastName,
          password
        );
        this.userRepository.save(user);
        resolve([null, null]);
      } catch (error) {
        if (error instanceof EmailError) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            message: 'Error al validar el email',
            error,
          });

          resolve([errorDto, null]);
        } else if (error instanceof PasswordError) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            message: 'Error al validar la contraseña',
            error,
          });
          resolve([errorDto, null]);
        }

        resolve([error, null]);
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
