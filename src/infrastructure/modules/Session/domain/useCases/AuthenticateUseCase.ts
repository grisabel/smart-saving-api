import {
  UserInterfaceRepository,
  UserRepositoryError,
} from '@application/repository/UserRepository/UserInterfaceRepository';
import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';

import {
  TokenInterfaceRepository,
  TokenRepositoryError,
} from '@Session/application/TokenRepositorty/TokenInterfaceRepositoty';
import { TokenFactoryRepository } from '@Session/application/TokenRepositorty/TokenFactoryRepository';

import JWTService, {
  AccessTokenPayload,
  JWTServiceError,
} from '@application/services/JWTService';

import { Email } from '@domain/models/Email';
import { Password } from '@domain/models/Password';

import { LoginResponseDto } from '@Session/infrastructure/dtos/response/LoginResponseDto';
import { LoginErrorResponseDto } from '@Session/infrastructure/dtos/response/LoginErrorResponseDto';
import { RefreshTokenErrorResponseDto } from '@Session/infrastructure/dtos/response/RefreshTokenErrorResponseDto';
import { RefreshTokenResponseDto } from '@Session/infrastructure/dtos/response/RefreshTokenResponseDto';

export class AuthenticateUseCase {
  constructor(
    private jwtService: typeof JWTService,
    private userRepository: UserInterfaceRepository,
    private tokenRepository: TokenInterfaceRepository
  ) {}

  authenticate(
    emailDto: string,
    passwordDto: string
  ): Promise<[LoginErrorResponseDto | null, LoginResponseDto | null]> {
    return new Promise(async (resolve) => {
      try {
        const email = Email.createFromText(emailDto);
        const passwordHash = Password.createFromHash(passwordDto);
        const user = await this.userRepository.findByEmail(email);

        const match = passwordHash.isEqual(user.getPassword());

        if (match) {
          const userPayload: AccessTokenPayload = {
            scope: 'smart-saving-api',
          };
          const accessToken = this.jwtService.createAccessToken(
            emailDto,
            userPayload
          );
          const refreshToken = this.jwtService.createRefreshToken(emailDto);

          const responseDto: LoginResponseDto = {
            accessToken,
            refreshToken,
          };

          await this.tokenRepository.save(refreshToken);
          resolve([null, responseDto]);
        } else {
          const errorDto = { message: 'Usuario o contraseña incorrectos' };
          resolve([errorDto, null]);
        }
      } catch (error) {
        if (error instanceof UserRepositoryError) {
          const errorDto: LoginErrorResponseDto = {
            message: 'Usuario o contraseña incorrectos',
          };
          resolve([errorDto, null]);
        }

        resolve([error, null]);
      }
    });
  }

  async verifyRefreshToken(
    refreshToken: string
  ): Promise<
    [RefreshTokenErrorResponseDto | null, RefreshTokenResponseDto | null]
  > {
    return new Promise(async (resolve) => {
      try {
        await this.tokenRepository.find(refreshToken);
        const tokenDetails = await this.jwtService.verifyRefreshToken(
          refreshToken
        );

        const userPayload: AccessTokenPayload = {
          scope: 'smart-saving-api',
        };
        const accessToken = this.jwtService.createAccessToken(
          tokenDetails.sub,
          userPayload
        );

        const dto: RefreshTokenResponseDto = {
          accessToken,
        };

        resolve([null, dto]);
      } catch (error) {
        if (
          error instanceof TokenRepositoryError ||
          error instanceof JWTServiceError
        ) {
          const dto: RefreshTokenErrorResponseDto = {
            message: 'Invalid Refresh Token', //todo
          };
          resolve([dto, null]);
        }

        resolve([error, null]);
      }
    });
  }

  async deleteRefreshToken(
    refreshToken: string
  ): Promise<[RefreshTokenErrorResponseDto | null, null]> {
    return new Promise(async (resolve) => {
      try {
        await this.tokenRepository.delete(refreshToken);

        resolve([null, null]);
      } catch (error) {
        if (
          error instanceof TokenRepositoryError ||
          error instanceof JWTServiceError
        ) {
          const dto: RefreshTokenErrorResponseDto = {
            message: 'Invalid Refresh Token', //todo
          };
          resolve([dto, null]);
        }

        resolve([error, null]);
      }
    });
  }
}

export class AuthenticateUseCaseFactory {
  static instance: AuthenticateUseCase | null = null;

  static getIntance(): AuthenticateUseCase {
    if (!AuthenticateUseCaseFactory.instance) {
      const userRepository = UserFactoryRepository.getInstance();
      const tokenRepository = TokenFactoryRepository.getInstance();

      AuthenticateUseCaseFactory.instance = new AuthenticateUseCase(
        JWTService,
        userRepository,
        tokenRepository
      );
    }
    return AuthenticateUseCaseFactory.instance;
  }
}
