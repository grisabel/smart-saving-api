import { UserLocalRepository } from './UserLocalRepository';
import { UserInterfaceRepository } from './UserInterfaceRepository';
import { UserExample } from '@domain/models/User/test/User.example';

describe('La clase UserLocalRepository', () => {
  let userRepository: UserInterfaceRepository;

  beforeEach(() => {
    userRepository = new UserLocalRepository();
  });

  it('guarda un usuario y comprueba si existe', () => {
    //arrange
    const user1 = UserExample.user1();
    //act
    userRepository.save(user1);
    const promise = userRepository.findByEmail(user1.getEmail());
    //assert
    expect.assertions(1);
    expect(promise).resolves.toEqual(user1);
  });

  it('comprueba que no existe el usuario por email', () => {
    //arrange
    const user1 = UserExample.user1();

    //act
    const promise = userRepository.findByEmail(user1.getEmail());
    //assert
    expect.assertions(1);
    expect(promise).resolves.toEqual(null);
  });
});
