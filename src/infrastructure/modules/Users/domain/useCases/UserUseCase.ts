import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';
import {
  UserInterfaceRepository,
  UserRepositoryError,
} from '@application/repository/UserRepository/UserInterfaceRepository';
import { Email } from '@domain/models/Email';
import { UserInfoResponseMapper } from '../../infrastructure/mappers/response/UserInfoResponseMapper';
import { UserInfoResponseDto } from '../../infrastructure/dtos/response/UserInfoResponseDto';
import { ErrorResponseMapper } from '@infrastructure/mappers/response/ErrorResponseMapper';
import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';
import { EmailError } from '@domain/models/Email/EmailError';
import { ResetPasswordResponseDto } from '@Users/infrastructure/dtos/response/ResetPasswordResponseDto';

export class UserUseCase {
  constructor(private userRepository: UserInterfaceRepository) {}

  obtainUserInfo(
    emailDto: string
  ): Promise<[ErrorResponseDto | Error, UserInfoResponseDto]> {
    return new Promise(async (resolve, reject) => {
      try {
        const email = Email.createFromText(emailDto);
        const userInfo = await this.userRepository.findByEmail(email);

        const responseDto = UserInfoResponseMapper.toResponseDto(userInfo);
        resolve([null, responseDto]);
      } catch (error) {
        if (
          error instanceof UserRepositoryError ||
          error instanceof EmailError
        ) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            message: 'Usuario no encontrado', // todo
          });
          resolve([errorDto, null]);
        }
        reject(error);
      }
    });
  }

  resetPassword(
    emailDto: string,
    dateBirth: string
  ): Promise<[ErrorResponseDto, ResetPasswordResponseDto]> {
    return new Promise(async (resolve, reject) => {
      try {
        const email = Email.createFromText(emailDto);
        const user = await this.userRepository.findByEmail(email);

        if (user.getDateBirth() === dateBirth) {
          // todo send email
        }

        const responseDto: ResetPasswordResponseDto = {
          menssage:
            'Si el usuario existe se habrá enviado un email para cambiar la contraseña',
        };
        resolve([null, responseDto]);
      } catch (error) {
        if (error instanceof UserRepositoryError) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            message:
              'Si el usuario existe se habrá enviado un email para cambiar la contraseña',
          });
        }
      }
    });
  }
}

export class UserUseCaseFactory {
  static instance: UserUseCase | null = null;

  static getIntance(): UserUseCase {
    if (!UserUseCaseFactory.instance) {
      const userRepository = UserFactoryRepository.getInstance();
      UserUseCaseFactory.instance = new UserUseCase(userRepository);
    }
    return UserUseCaseFactory.instance;
  }
}
