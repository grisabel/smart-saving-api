import { Email } from '@domain/models/Email';
import { Password } from '@domain/models/Password';
import { User } from '@domain/models/User';
import { UserLocalRepository } from './UserLocalRepository';
import { UserInterfaceRepository } from './UserInterfaceRepository';

describe('La clase UserLocalRepository', () => {
  const textEmail1 = 'test@test.com';
  const textEmail2 = 'test2@test.com';
  const textPassword = 'Aabb@1';
  const firstName = 'TestName';
  const lastname = 'TestLastName';
  const dateBirth = '01/01/2000';
  const objective = 'Jubilación';
  const lastSession = '1701959641000';
  const email1 = Email.createFromText(textEmail1);
  const email2 = Email.createFromText(textEmail2);
  const password = Password.createFromHash(textPassword);
  const user1 = new User(
    email1,
    firstName,
    lastname,
    dateBirth,
    objective,
    lastSession,
    password
  );
  const user2 = new User(
    email2,
    firstName,
    lastname,
    dateBirth,
    objective,
    lastSession,
    password
  );
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
