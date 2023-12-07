import { UserLocalRepository } from './UserLocalRepository';
import { UserInterfaceRepository } from './UserInterfaceRepository';
import { UserExample } from '@domain/models/User/test/User.example';

describe('La clase UserLocalRepository', () => {
  const user1 = UserExample.user1();
  const user2 = UserExample.user2();

  it('guarda un usuario y comprueba si existe', () => {
    //arrange
    const userRepository: UserInterfaceRepository = new UserLocalRepository();
    //act
    userRepository.save(user1);
    const promise = userRepository.findByEmail(user1.getEmail());
    //assert
    expect.assertions(1);
    expect(promise).resolves.toEqual(user1);
  });
  it('comprueba que no existe el usuario por email', () => {
    //arrange
    const userRepository: UserInterfaceRepository = new UserLocalRepository();
    //act
    const promise = userRepository.findByEmail(user2.getEmail());
    //assert
    expect.assertions(1);
    expect(promise).resolves.toEqual(null);
  });
});
