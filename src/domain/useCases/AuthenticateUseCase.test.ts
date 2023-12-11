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
    const user1 = UserExample.user1();
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
});
