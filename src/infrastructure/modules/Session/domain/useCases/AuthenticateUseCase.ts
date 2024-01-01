import {
  UserInterfaceRepository,
  UserRepositoryError,
} from '@application/repository/UserRepository/UserInterfaceRepository';
import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';

import {
  RevokeAccessTokenInterfaceRepository,
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
import {
  SessionInterfaceRepository,
  SessionReasonType,
} from '@Session/application/SessionRepository/SessionInterfaceRepository';
import { SessionFactoryRepository } from '../../application/SessionRepository/SessionFactoryRepository';
import { email } from '@infrastructure/middlewares/validators/body/EmailValidator';

export class AuthenticateUseCase {
  constructor(
    private jwtService: typeof JWTService,
    private userRepository: UserInterfaceRepository,
    private tokenRepository: RevokeAccessTokenInterfaceRepository,
    private sessionRepository: SessionInterfaceRepository
  ) {}

  authenticate(
    emailDto: string,
    passwordDto: string,
    ip: string
  ): Promise<[ErrorResponseDto | null, LoginResponseDto | null]> {
    return new Promise(async (resolve, reject) => {
      try {
        const email = Email.createFromText(emailDto);
        const passwordHash = Password.createHash(passwordDto);
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

          await this.sessionRepository.saveSessionStart(
            email,
            ip,
            `${expiredIn}`,
            true
          );

          resolve([null, responseDto]);
        } else {
          const errorDto = ErrorResponseMapper.toResponseDto({
            message: 'Usuario o contraseña incorrectos',
          });

          await this.sessionRepository.saveSessionStart(email, ip, null, false);

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

        reject(error);
      }
    });
  }

  async verifyRefreshToken(
    refreshToken: string,
    ip: string
  ): Promise<[ErrorResponseDto | null, RefreshTokenResponseDto | null]> {
    return new Promise(async (resolve, reject) => {
      try {
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

        await this.sessionRepository.saveSessionRefresh(
          Email.createFromText(tokenDetails.sub),
          ip,
          `${expiredIn}`
        );

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

        reject(error);
      }
    });
  }

  verifyAccessToken(accessToken: string): Promise<[Error, { email: string }]> {
    return new Promise(async (resolve, reject) => {
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
          if (error instanceof JWTServiceError) {
            resolve([error, null]);
          }
          reject(error);
        }
      }
    });
  }

  async logoutAccessToken(
    email: Email,
    ip: string,
    reason: SessionReasonType
  ): Promise<[ErrorResponseDto | null, null]> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.sessionRepository.saveSessionEnd(email, ip, reason);

        resolve([null, null]);
      } catch (error) {
        reject(error);
      }
    });
  }

  async revokeAccessToken(
    accessToken: string,
    email: Email,
    ip: string
  ): Promise<[ErrorResponseDto | null, null]> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.tokenRepository.save(accessToken);
        await this.sessionRepository.saveSessionRevoke(email, ip);

        resolve([null, null]);
      } catch (error) {
        reject(error);
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
      const sessionRepository = SessionFactoryRepository.getInstance();

      AuthenticateUseCaseFactory.instance = new AuthenticateUseCase(
        JWTService,
        userRepository,
        tokenRepository,
        sessionRepository
      );
    }
    return AuthenticateUseCaseFactory.instance;
  }
}
