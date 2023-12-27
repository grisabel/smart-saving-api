import { UserInterfaceRepository } from '@application/repository/UserRepository/UserInterfaceRepository';
import JWTService from '@application/services/JWTService';
import { Email } from '@domain/models/Email';
import { Password } from '@domain/models/Password';
import { LoginResponseDto } from '@infrastructure/modules/Session/dtos/response/LoginResponseDto';

import { LoginErrorResponseDto } from '@infrastructure/modules/Session/dtos/response/LoginErrorResponseDto';
import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';
import {
  TokenInterfaceRepository,
  TokenRepositoryError,
} from '@application/repository/TokenRepositorty/TokenInterfaceRepositoty';
import { TokenFactoryRepository } from '@application/repository/TokenRepositorty/TokenFactoryRepository';
import { RefreshTokenErrorResponseDto } from '@infrastructure/modules/Session/dtos/response/RefreshTokenErrorResponseDto';
import { AccessTokenPayload } from '@application/services/JWTService/JWTService';
import { RefreshTokenResponseDto } from '@infrastructure/modules/Session/dtos/response/RefreshTokenResponseDto';

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
        const errorDto: LoginErrorResponseDto = {
          message: 'Usuario o contraseña incorrectos',
        };
        resolve([errorDto, null]);
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
        const dto: RefreshTokenErrorResponseDto = {
          message: 'Invalid Refresh Token', //todo
        };
        resolve([dto, null]);
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
        const dto: RefreshTokenErrorResponseDto = {
          message: 'Invalid Refresh Token', //todo
        };
        resolve([dto, null]);
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
