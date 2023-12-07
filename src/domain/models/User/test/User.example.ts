import { Email } from '../../Email';
import { Password } from '../../Password';
import { User } from '../User';

export class UserExample {
  static user1(): User {
    const textEmail = 'test@test.com';
    const textPassword = 'Aabb@1';
    const firstName = 'TestName';
    const lastname = 'TestLastName';
    const dateBirth = '01/01/2000';
    const objective = 'Jubilación';
    const lastSession = '1701959641000';

    const email = Email.createFromText(textEmail);
    const password = Password.createFromHash(textPassword);
    const user1 = new User(
      email,
      firstName,
      lastname,
      dateBirth,
      objective,
      lastSession,
      password
    );

    return user1;
  }

  static user2(): User {
    const textEmail = 'test2@test.com';
    const textPassword = 'Aabb@2';
    const firstName = 'TestName';
    const lastname = 'TestLastName';
    const dateBirth = '01/01/2000';
    const objective = 'Jubilación';
    const lastSession = '1701959641000';

    const email = Email.createFromText(textEmail);
    const password = Password.createFromHash(textPassword);
    const user1 = new User(
      email,
      firstName,
      lastname,
      dateBirth,
      objective,
      lastSession,
      password
    );

    return user1;
  }
}