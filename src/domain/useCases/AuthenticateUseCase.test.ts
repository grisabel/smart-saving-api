import { UserInterfaceRepository } from '@application/repository/UserRepository/UserInterfaceRepository';
import { AuthenticateUseCase } from './AuthenticateUseCase';
import { UserLocalRepository } from '@application/repository/UserRepository/UserLocalRepository';
import { UserExample } from '@domain/models/User/test/User.example';

describe('La clase AuthenticationUseCase', () => {
  let userRepository: UserInterfaceRepository;

  beforeEach(() => {
    userRepository = new UserLocalRepository();
  });
  it('debe devolver un jwt dado un usuario y contraseña correctos', async () => {
    //arrange
    const user1 = UserExample.user1_text();
    const emailDTO = user1.getEmail().getValue();
    const passwordDTO = user1.getPassword().getValue();
    const authenticateClass = new AuthenticateUseCase(userRepository);

    //act
    await userRepository.save(user1);
    const [error, resultDto] = await authenticateClass.authenticate(
      emailDTO,
      passwordDTO
    );

    //asert
    expect(resultDto.accessToken.split('.').length).toEqual(3);
  });

  it('debe lanzar un error si el usuario no existe', async () => {
    //arrange
    const user1 = UserExample.user1_text();
    const emailDTO = user1.getEmail().getValue();
    const passwordDTO = user1.getPassword().getValue();
    const authenticateClass = new AuthenticateUseCase(userRepository);

    //act
    const [error, resultDto] = await authenticateClass.authenticate(
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
    const authenticateClass = new AuthenticateUseCase(userRepository);

    //act
    await userRepository.save(user1);
    const [error, resultDto] = await authenticateClass.authenticate(
      emailDTO,
      passwordDTO
    );

    //asert
    expect(error.message).toEqual('Usuario o contraseña incorrectos');
  });
});
