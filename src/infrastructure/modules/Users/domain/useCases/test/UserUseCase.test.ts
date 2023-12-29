import { UserInterfaceRepository } from '@application/repository/UserRepository/UserInterfaceRepository';
import { UserLocalRepository } from '@application/repository/UserRepository/UserLocalRepository';
import { EmailError } from '@domain/models/Email/EmailError';
import { UserExample } from '@domain/models/User/test/User.example';
import { AuthenticateUseCase } from '@infrastructure/modules/Session/domain/useCases/AuthenticateUseCase';
import { UserUseCase } from '@Users/domain/useCases/UserUseCase';
describe('La clase UserUseCase', () => {
  let userRepository: UserInterfaceRepository;
  let userUseCase: UserUseCase;

  beforeEach(() => {
    userRepository = new UserLocalRepository();
    userUseCase = new UserUseCase(userRepository);
  });
  describe('el método obtainUser', () => {
    it('debe devolver un UserInfoResponseDto dado un usuario registrado', async () => {
      // Arange
      const user1 = UserExample.user1_text();
      await userRepository.save(user1);

      // Act
      const [, userInfo] = await userUseCase.obtainUserInfo(
        user1.getEmail().getValue()
      );

      // Arrange
      expect(userInfo.firstName).toEqual(user1.getFirtname());
      expect(userInfo.lastName).toEqual(user1.getLastname());
      expect(userInfo.dateBirth).toEqual(user1.getDateBirth());
      expect(userInfo.objective).toEqual(user1.getObjective());
      expect(userInfo.email).toEqual(user1.getEmail().getValue());
    });
    it('debe lanzar un error dado un email invalido', async () => {
      // Arange
      const emailDto = 'aa@a.com';

      // Act
      const [errorDto] = await userUseCase.obtainUserInfo(emailDto);

      // Arrange
      expect(errorDto.message).toEqual('Usuario no encontrado'); // todo
    });
    it('debe lanzar un error dado un usuario no registrado', async () => {
      // Arange
      const user1 = UserExample.user1_text();

      // Act
      const [errorDto] = await userUseCase.obtainUserInfo(
        user1.getEmail().getValue()
      );

      // Arrange
      expect(errorDto.message).toEqual('Usuario no encontrado'); // todo
    });
  });
});
// TODO AÑADIR ERROR GENERICO
