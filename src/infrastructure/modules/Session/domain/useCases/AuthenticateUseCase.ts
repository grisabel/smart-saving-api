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
import { RefreshTokenResponseDto } from '@Session/infrastructure/dtos/response/RefreshTokenResponseDto';
import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';
import { ErrorResponseMapper } from '@infrastructure/mappers/response/ErrorResponseMapper';
import { EmailError } from '@domain/models/Email/EmailError';

export class AuthenticateUseCase {
  constructor(
    private jwtService: typeof JWTService,
    private userRepository: UserInterfaceRepository,
    private tokenRepository: TokenInterfaceRepository
  ) {}

  authenticate(
    emailDto: string,
    passwordDto: string
  ): Promise<[ErrorResponseDto | null, LoginResponseDto | null]> {
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
          const { accessToken, expiredIn } = this.jwtService.createAccessToken(
            emailDto,
            userPayload
          );
          const refreshToken = this.jwtService.createRefreshToken(emailDto);

          const responseDto: LoginResponseDto = {
            accessToken,
            refreshToken,
            token_type: 'bearer',
            expires: expiredIn,
          };

          await this.tokenRepository.save(refreshToken);
          resolve([null, responseDto]);
        } else {
          const errorDto = ErrorResponseMapper.toResponseDto({
            message: 'Usuario o contraseña incorrectos',
          });
          resolve([errorDto, null]);
        }
      } catch (error) {
        if (
          error instanceof UserRepositoryError ||
          error instanceof EmailError
        ) {
          const errorDto = ErrorResponseMapper.toResponseDto({
            message: 'Usuario o contraseña incorrectos',
          });
          resolve([errorDto, null]);
        }

        resolve([error, null]);
      }
    });
  }

  async verifyRefreshToken(
    refreshToken: string
  ): Promise<[ErrorResponseDto | null, RefreshTokenResponseDto | null]> {
    return new Promise(async (resolve) => {
      try {
        await this.tokenRepository.find(refreshToken);
        const tokenDetails = await this.jwtService.verifyRefreshToken(
          refreshToken
        );

        const userPayload: AccessTokenPayload = {
          scope: 'smart-saving-api',
        };
        const { accessToken, expiredIn } = this.jwtService.createAccessToken(
          tokenDetails.sub,
          userPayload
        );

        const dto: RefreshTokenResponseDto = {
          accessToken,
          token_type: 'bearer',
          expires: expiredIn,
        };

        resolve([null, dto]);
      } catch (error) {
        if (
          error instanceof TokenRepositoryError ||
          error instanceof JWTServiceError
        ) {
          const dto = ErrorResponseMapper.toResponseDto({
            message: 'Invalid Refresh Token', //todo
          });
          resolve([dto, null]);
        }

        resolve([error, null]);
      }
    });
  }

  verifyAccessToken(accessToken: string): Promise<[Error, { email: string }]> {
    return new Promise(async (resolve) => {
      try {
        // TODO change repository
        const revokeToken = await this.tokenRepository.find(accessToken);
        if (revokeToken) {
          const error = new Error('Revoke Token');
          resolve([error, null]);
          return;
        }
      } catch (error) {
        try {
          const decodeToken = JWTService.verifyAcessToken(accessToken);
          const user = { email: decodeToken.sub };
          resolve([null, user]);
        } catch (error) {
          resolve([error, null]);
        }
      }
    });
  }

  async deleteRefreshToken(
    refreshToken: string
  ): Promise<[ErrorResponseDto | null, null]> {
    return new Promise(async (resolve) => {
      try {
        await this.tokenRepository.delete(refreshToken);

        resolve([null, null]);
      } catch (error) {
        if (
          error instanceof TokenRepositoryError ||
          error instanceof JWTServiceError
        ) {
          const dto = ErrorResponseMapper.toResponseDto({
            message: 'Invalid Refresh Token', //todo
          });
          resolve([dto, null]);
        }

        resolve([error, null]);
      }
    });
  }

  async revokeAccessToken(
    accessToken: string
  ): Promise<[ErrorResponseDto | null, null]> {
    return new Promise(async (resolve) => {
      try {
        await this.tokenRepository.save(accessToken); // TODO

        resolve([null, null]);
      } catch (error) {
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
