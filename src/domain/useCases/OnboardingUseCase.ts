import { Email } from '../models/Email';
import { Password } from '../models/Password';
import { User } from '../models/User';
import { EmailError } from '../models/Email/EmailError';
import { PasswordError } from '../models/Password/PasswordError';
import { PostUserDTO } from '@infrastructure/modules/users/dtos/request/PostUserDTO';
import { DomainErrorResponseMapper } from '@infrastructure/mappers/response/DomainErrorResponseMapper';
import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';
import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';
import { UserInterfaceRepository } from '@application/repository/UserRepository/UserInterfaceRepository';

export class OnboardingUseCase {
  constructor(private userRepository: UserInterfaceRepository) {}
  saveUser(userDTO: PostUserDTO): Promise<[ErrorResponseDto]> {
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
        resolve([null]);
      } catch (error) {
        if (error instanceof EmailError) {
          const errorDto = DomainErrorResponseMapper.toResponse(
            error,
            'Error al validar el email'
          );
          resolve([errorDto]);
        } else if (error instanceof PasswordError) {
          const errorDto = DomainErrorResponseMapper.toResponse(
            error,
            'Error al validar la contraseña'
          );
          resolve([errorDto]);
        }

        resolve([error]);
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
