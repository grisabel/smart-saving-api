import { UserInterfaceRepository } from '@application/repository/UserRepository/UserInterfaceRepository';
import JWTService from '@application/services/JWTService';
import { Email } from '@domain/models/Email';
import { Password } from '@domain/models/Password';
import { LoginResponseDto } from '@infrastructure/modules/users/dtos/response/LoginResponseDto';

import {
  LOGIN_ERROR,
  LoginErrorDto,
} from '@infrastructure/modules/users/dtos/response/LoginErrorDto';
import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';

export class AuthenticateUseCase {
  constructor(private userRepository: UserInterfaceRepository) {}
  authenticate(
    emailDto: string,
    passwordDto: string
  ): Promise<[LoginErrorDto | null, LoginResponseDto | null]> {
    return new Promise(async (resolve) => {
      try {
        const email = Email.createFromText(emailDto);
        const passwordHash = Password.createFromHash(passwordDto);
        const user = await this.userRepository.findByEmail(email);

        const match = passwordHash.isEqual(user.getPassword());

        if (match) {
          const userPayload = {
            scope: 'smart-saving-api',
          };
          const accessToken = JWTService.createAccessToken(
            emailDto,
            userPayload
          );
          const refreshToken = JWTService.createRefreshToken(emailDto);

          const responseDto: LoginResponseDto = {
            accessToken,
            refreshToken,
          };
          resolve([null, responseDto]);
        } else {
          const errorDto = { message: LOGIN_ERROR.msg };
          resolve([errorDto, null]);
        }
      } catch (error) {
        const errorDto = { message: LOGIN_ERROR.msg };
        resolve([errorDto, null]);
      }
    });
  }
}

export class AuthenticateUseCaseFactory {
  static instance: AuthenticateUseCase | null = null;

  static getIntance(): AuthenticateUseCase {
    if (!AuthenticateUseCaseFactory.instance) {
      const userRepository = UserFactoryRepository.getInstance();
      AuthenticateUseCaseFactory.instance = new AuthenticateUseCase(
        userRepository
      );
    }
    return AuthenticateUseCaseFactory.instance;
  }
}
