import { Email } from '../Email';
import { Password } from '../Password';
import { User } from './User';

describe('La clase usuario', () => {
  it('puede generar una instacia a través de su constructor', () => {
    //arange
    const textEmail = 'test@test.com';
    const textPasword = 'Aabb@1';
    const firstName = 'TestName';
    const lastname = 'TestLastName';
    const dateBirth = '01/01/2000';
    const objective = 'Jubilación';
    const lastSession = '1701959641000';

    //act
    const email = Email.createFromText(textEmail);
    const password = Password.createFromHash(textPasword);
    const result = new User(
      email,
      firstName,
      lastname,
      dateBirth,
      objective,
      lastSession,
      password
    );

    //assert
    expect(result).toBeInstanceOf(User);
  });
});
