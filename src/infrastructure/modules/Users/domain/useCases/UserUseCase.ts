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
import {
  EmailService,
  EmailServiceFactory,
} from '@application/services/EmailService/EmailService';
import config from '@infrastructure/config';
import {
  OperationsIdInterfaceRepository,
  OperationsIdRepositoryError,
} from '@application/repository/OperationsId/OperationIdInterfaceRepository';
import { OperationsIdFactoryRepository } from '@application/repository/OperationsId/OperationsIdFactoryRepository';
import { Id } from '@domain/models/Id/Id';
import {
  Operation,
  OperationType,
} from '@application/repository/OperationsId/models/OperationId';
import { Password } from '@domain/models/Password';
import { ResetPasswordConfirmResponseDto } from '@Users/infrastructure/dtos/response/ResetPasswordConfirmResponseDto';
import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DeleteAccountResponseDto } from '../../infrastructure/dtos/response/DeleteAccountResponseDto';

export class UserUseCase {
  constructor(
    private userRepository: UserInterfaceRepository,
    private emailService: EmailService,
    private operationIdRepository: OperationsIdInterfaceRepository
  ) {}

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
    email: Email,
    dateBirth: string
  ): Promise<[ErrorResponseDto, ResetPasswordResponseDto]> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userRepository.findByEmail(email);

        if (user.getDateBirth() === dateBirth) {
          const operation: Operation = {
            email: email.getValue(),
            id: Id.createId().getValue(),
            type: OperationType.RESET_PASSWORD,
            expiresIn: DateTimeService.now() + 60 * 60 * 1000,
          };

          await this.operationIdRepository.save(operation);

          if (config.ENV !== 'E2E') {
            await this.emailService.send(email, operation);
          }
        }

        const responseDto: ResetPasswordResponseDto = {
          message:
            'Si el usuario existe se habrá enviado un email para cambiar la contraseña', //todo
        };
        resolve([null, responseDto]);
      } catch (error) {
        if (error instanceof UserRepositoryError) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            message:
              'Si el usuario existe se habrá enviado un email para cambiar la contraseña',
          });
          resolve([errorDto, null]);
          return;
        }
        reject(error);
      }
    });
  }

  resetPasswordConfirm(
    id: Id,
    newPassword: Password
  ): Promise<[ErrorResponseDto, ResetPasswordConfirmResponseDto]> {
    return new Promise(async (resolve, reject) => {
      try {
        const operation = await this.operationIdRepository.find(id);

        if (operation.expiresIn <= DateTimeService.now()) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            status: 410,
            message: 'OperationId expirado',
          });
          resolve([errorDto, null]);
          return;
        }

        const user = await this.userRepository.findByEmail(
          Email.createFromText(operation.email)
        );
        user.changePassword(newPassword);

        await this.userRepository.update(user);
        await this.operationIdRepository.delete(id);

        const responseDto: ResetPasswordConfirmResponseDto = {
          status: 200,
          message: 'Contraseña actualizada satisfactoriamente', //todo
        };
        resolve([null, responseDto]);
      } catch (error) {
        if (
          error instanceof OperationsIdRepositoryError ||
          error instanceof UserRepositoryError
        ) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            status: 404,
            message: 'OperationId invalido',
          });
          resolve([errorDto, null]);
          return;
        }
        reject(error);
      }
    });
  }

  deleteAccount(
    email: Email
  ): Promise<[ErrorResponseDto, DeleteAccountResponseDto]> {
    return new Promise(async (resolve, reject) => {
      try {
        const operation: Operation = {
          email: email.getValue(),
          id: Id.createId().getValue(),
          type: OperationType.DELETE_ACCOUNT,
          expiresIn: DateTimeService.now() + 15 * 24 * 60 * 60 * 1000,
        };

        await this.operationIdRepository.save(operation);

        const responseDto: DeleteAccountResponseDto = {
          status: 200,
          operationId: operation.id,
        };
        resolve([null, responseDto]);
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteAccountConfirm(
    id: Id,
    email: Email,
    password: Password
  ): Promise<[ErrorResponseDto, ResetPasswordConfirmResponseDto]> {
    return new Promise(async (resolve, reject) => {
      try {
        const operation = await this.operationIdRepository.find(id);

        if (operation.expiresIn <= DateTimeService.now()) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            status: 410,
            message: 'OperationId expirado',
          });
          resolve([errorDto, null]);
          return;
        }

        const user = await this.userRepository.findByEmail(email);
        const match = password.isEqual(user.getPassword());
        if (!match) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            status: 403,
            message: 'Contraseña incorrecta',
          });
          resolve([errorDto, null]);
        }

        await this.userRepository.delete(email);
        await this.operationIdRepository.delete(id);

        const responseDto: ResetPasswordConfirmResponseDto = {
          status: 200,
          message: 'Cuenta eliminada con éxito', //todo
        };
        resolve([null, responseDto]);
      } catch (error) {
        if (error instanceof OperationsIdRepositoryError) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            status: 404,
            message: 'OperationId invalido',
          });
          resolve([errorDto, null]);
          return;
        }
        reject(error);
      }
    });
  }
}

export class UserUseCaseFactory {
  static instance: UserUseCase | null = null;

  static getIntance(): UserUseCase {
    if (!UserUseCaseFactory.instance) {
      const userRepository = UserFactoryRepository.getInstance();
      const emailService = EmailServiceFactory.getInstance();
      const operationIdRepository = OperationsIdFactoryRepository.getInstance();

      UserUseCaseFactory.instance = new UserUseCase(
        userRepository,
        emailService,
        operationIdRepository
      );
    }
    return UserUseCaseFactory.instance;
  }
}
