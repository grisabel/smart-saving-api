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

  it('debe determinar si dos usuarios son el mismo', () => {
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
    const user1 = new User(
      email,
      firstName,
      lastname,
      dateBirth,
      objective,
      lastSession,
      password
    );
    const user2 = new User(
      email,
      firstName,
      lastname,
      dateBirth,
      objective,
      lastSession,
      password
    );

    const result = user1.isEqual(user2);

    //assert
    expect(result).toEqual(true);
  });
  it('debe determinar si dos usuarios son distintos', () => {
    //arange
    const textEmail1 = 'test@test.com';
    const textEmail2 = 'test@test.com';
    const textPasword = 'Aabb@1';
    const firstName = 'TestName';
    const lastname = 'TestLastName';
    const dateBirth = '01/01/2000';
    const objective = 'Jubilación';
    const lastSession = '1701959641000';

    //act
    const email1 = Email.createFromText(textEmail1);
    const email2 = Email.createFromText(textEmail2);
    const password = Password.createFromHash(textPasword);
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

    const result = user1.isEqual(user2);

    //assert
    expect(result).toEqual(false);
  });
});
