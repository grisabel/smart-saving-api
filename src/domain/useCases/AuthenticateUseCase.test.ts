import { UserInterfaceRepository } from '@application/repository/UserRepository/UserInterfaceRepository';
import { AuthenticateUseCase } from './AuthenticateUseCase';
import { UserLocalRepository } from '@application/repository/UserRepository/UserLocalRepository';
import { UserExample } from '@domain/models/User/test/User.example';
import { TokenInterfaceRepository } from '@application/repository/TokenRepositorty/TokenInterfaceRepositoty';
import JWTService from '@application/services/JWTService';
import { TokenLocalRepository } from '@application/repository/TokenRepositorty/TokenLocalRepository';

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
});
