import { UserInterfaceRepository } from '@application/repository/UserRepository/UserInterfaceRepository';
import { UserLocalRepository } from '@application/repository/UserRepository/UserLocalRepository';
import { UserExample } from '@domain/models/User/test/User.example';

import { TokenLocalRepository } from '@Session/application/TokenRepositorty/TokenLocalRepository';
import { RevokeAccessTokenInterfaceRepository } from '@Session/application/TokenRepositorty/TokenInterfaceRepositoty';
import { TokenExample } from '@application/services/JWTService/test/Token.example';

import JWTService from '@application/services/JWTService';
import { SessionInterfaceRepository } from '@Session/application/SessionRepository/SessionInterfaceRepository';
import { SessionLocalRepository } from '@Session/application/SessionRepository/SessionLocalRepository';

import { AuthenticateUseCase } from './AuthenticateUseCase';

describe('La clase AuthenticationUseCase', () => {
  let userRepository: UserInterfaceRepository;
  let tokenRepository: RevokeAccessTokenInterfaceRepository;
  let jwtTokenService: typeof JWTService;
  let sessionRepository: SessionInterfaceRepository;

  let authenticationUseCase: AuthenticateUseCase;

  beforeEach(() => {
    userRepository = new UserLocalRepository();
    tokenRepository = new TokenLocalRepository();
    jwtTokenService = JWTService;
    sessionRepository = new SessionLocalRepository();

    authenticationUseCase = new AuthenticateUseCase(
      jwtTokenService,
      userRepository,
      tokenRepository,
      sessionRepository
    );
  });

  describe('el método authenticate', () => {
    it('debe devolver un accessToken y refreshToken dado un usuario y contraseña correctos', async () => {
      //arrange
      const user1 = UserExample.user1_text();
      const emailDTO = user1.getEmail().getValue();
      const passwordDTO = user1.getPassword().getValue();
      const ip = '69.89.31.226';
      //act
      await userRepository.save(user1);
      const [error, resultDto] = await authenticationUseCase.authenticate(
        emailDTO,
        passwordDTO,
        ip
      );

      //asert
      expect(resultDto.accessToken.split('.').length).toEqual(3);
      expect(resultDto.refreshToken.split('.').length).toEqual(3);
      expect(resultDto.token_type).toEqual('bearer');
      expect(typeof resultDto.expires).toBe('number');
    });

    it('debe lanzar un error si el usuario no existe', async () => {
      //arrange
      const user1 = UserExample.user1_text();
      const emailDTO = user1.getEmail().getValue();
      const passwordDTO = user1.getPassword().getValue();
      const ip = '69.89.31.226';

      //act
      const [error, resultDto] = await authenticationUseCase.authenticate(
        emailDTO,
        passwordDTO,
        ip
      );

      //asert
      expect(error.message).toEqual('Usuario o contraseña incorrectos');
    });

    it('debe lanzar un error si el usuario y la contraseña no coinciden', async () => {
      //arrange
      const user1 = UserExample.user1_text();
      const emailDTO = user1.getEmail().getValue();
      const passwordDTO = user1.getPassword().getValue() + '0';
      const ip = '69.89.31.226';

      //act
      await userRepository.save(user1);
      const [error, resultDto] = await authenticationUseCase.authenticate(
        emailDTO,
        passwordDTO,
        ip
      );

      //asert
      expect(error.message).toEqual('Usuario o contraseña incorrectos');
    });
  });

  describe('el método verifyRefreshToken', () => {
    it('debe retornar un nuevo accessToken dado un refreshToken válido', async () => {
      //arrange
      const user1 = UserExample.user1_text();
      const emailDTO = user1.getEmail().getValue();
      const passwordDTO = user1.getPassword().getValue();
      const ip = '69.89.31.226';

      //act
      await userRepository.save(user1);
      const [, loginDto] = await authenticationUseCase.authenticate(
        emailDTO,
        passwordDTO,
        ip
      );

      const [, verifyRTokenDto] =
        await authenticationUseCase.verifyRefreshToken(
          loginDto.refreshToken,
          ip
        );

      //asert
      expect(verifyRTokenDto.accessToken.split('.').length).toEqual(3);
      expect(verifyRTokenDto.token_type).toEqual('bearer');
      expect(typeof verifyRTokenDto.expires).toBe('number');
    });
    it('debe lanzar un error si el refreshToken no existe', async () => {
      //arrange
      const refreshToken = TokenExample.refreshToken();
      const ip = '69.89.31.226';

      //act
      const [error] = await authenticationUseCase.verifyRefreshToken(
        refreshToken,
        ip
      );

      //asert
      expect(error.message).toEqual('Invalid Refresh Token');
    });
    it('debe lanzar un error si el refreshToken no es válido', async () => {
      const refreshToken = TokenExample.invalidToken();
      const ip = '69.89.31.226';

      //act
      await tokenRepository.save(refreshToken);
      const [error] = await authenticationUseCase.verifyRefreshToken(
        refreshToken,
        ip
      );

      //asert
      expect(error.message).toEqual('Invalid Refresh Token');
    });
  });

  describe('el método revokeAccessToken', () => {
    it('debe añadir un accessToken al repositorio de token', async () => {
      //arrange
      const accessToken = TokenExample.accessToken();

      //act
      await authenticationUseCase.revokeAccessToken(accessToken);
      const savedToken = await tokenRepository.find(accessToken);

      //asert
      expect(accessToken).toEqual(savedToken);
    });
  });
});
