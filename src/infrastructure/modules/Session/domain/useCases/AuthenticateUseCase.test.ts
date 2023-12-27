import { UserInterfaceRepository } from '@application/repository/UserRepository/UserInterfaceRepository';
import { UserLocalRepository } from '@application/repository/UserRepository/UserLocalRepository';
import { UserExample } from '@domain/models/User/test/User.example';

import { TokenLocalRepository } from '@Session/application/TokenRepositorty/TokenLocalRepository';
import { TokenInterfaceRepository } from '@Session/application/TokenRepositorty/TokenInterfaceRepositoty';
import { TokenExample } from '@application/services/JWTService/test/Token.example';

import JWTService from '@application/services/JWTService';

import { AuthenticateUseCase } from './AuthenticateUseCase';

describe('La clase AuthenticationUseCase', () => {
  let userRepository: UserInterfaceRepository;
  let tokenRepository: TokenInterfaceRepository;
  let jwtTokenService: typeof JWTService;
  let authenticationUseCase: AuthenticateUseCase;

  beforeEach(() => {
    userRepository = new UserLocalRepository();
    tokenRepository = new TokenLocalRepository();
    jwtTokenService = JWTService;
    authenticationUseCase = new AuthenticateUseCase(
      jwtTokenService,
      userRepository,
      tokenRepository
    );
  });

  describe('el método authenticate', () => {
    it('debe devolver un accessToken y refreshToken dado un usuario y contraseña correctos', async () => {
      //arrange
      const user1 = UserExample.user1_text();
      const emailDTO = user1.getEmail().getValue();
      const passwordDTO = user1.getPassword().getValue();

      //act
      await userRepository.save(user1);
      const [error, resultDto] = await authenticationUseCase.authenticate(
        emailDTO,
        passwordDTO
      );

      //asert
      expect(resultDto.accessToken.split('.').length).toEqual(3);
      expect(resultDto.refreshToken.split('.').length).toEqual(3);
    });

    it('debe lanzar un error si el usuario no existe', async () => {
      //arrange
      const user1 = UserExample.user1_text();
      const emailDTO = user1.getEmail().getValue();
      const passwordDTO = user1.getPassword().getValue();

      //act
      const [error, resultDto] = await authenticationUseCase.authenticate(
        emailDTO,
        passwordDTO
      );

      //asert
      expect(error.message).toEqual('Usuario o contraseña incorrectos');
    });

    it('debe lanzar un error si el usuario y la contraseña no coinciden', async () => {
      //arrange
      const user1 = UserExample.user1_text();
      const emailDTO = user1.getEmail().getValue();
      const passwordDTO = user1.getPassword().getValue() + '0';

      //act
      await userRepository.save(user1);
      const [error, resultDto] = await authenticationUseCase.authenticate(
        emailDTO,
        passwordDTO
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

      //act
      await userRepository.save(user1);
      const [, loginDto] = await authenticationUseCase.authenticate(
        emailDTO,
        passwordDTO
      );

      const [, verifyRTokenDto] =
        await authenticationUseCase.verifyRefreshToken(loginDto.refreshToken);

      //asert
      expect(verifyRTokenDto.accessToken.split('.').length).toEqual(3);
    });
    it('debe lanzar un error si el refreshToken no existe', async () => {
      //arrange
      const refreshToken = TokenExample.refreshToken();

      //act
      const [error] = await authenticationUseCase.verifyRefreshToken(
        refreshToken
      );

      //asert
      expect(error.message).toEqual('Invalid Refresh Token');
    });
    it('debe lanzar un error si el refreshToken no es válido', async () => {
      const refreshToken = TokenExample.invalidToken();

      //act
      await tokenRepository.save(refreshToken);
      const [error] = await authenticationUseCase.verifyRefreshToken(
        refreshToken
      );

      //asert
      expect(error.message).toEqual('Invalid Refresh Token');
    });
  });

  describe('el método deleteRefreshToken', () => {
    it('debe eliminar un refreshToken', async () => {
      //arrange
      const refreshToken = TokenExample.refreshToken();

      //act
      await tokenRepository.save(refreshToken);
      const [, deleteRTokenDto] =
        await authenticationUseCase.deleteRefreshToken(refreshToken);

      //asert
      expect(deleteRTokenDto).toEqual(null);
    });
    it('debe lanzar un error si el refreshToken no existe', async () => {
      //arrange
      const refreshToken = TokenExample.refreshToken();

      //act
      const [error] = await authenticationUseCase.deleteRefreshToken(
        refreshToken
      );

      //asert
      expect(error.message).toEqual('Invalid Refresh Token');
    });
  });
});
