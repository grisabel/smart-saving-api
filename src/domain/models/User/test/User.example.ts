import { Email } from '../../Email';
import { Password } from '../../Password';
import { User } from '../User';

export class UserExample {
  static user1_text(): User {
    const _textEmail = 'test@test.com';
    const _textPassword = 'Aabb@1';
    const _firstName = 'User1Name';
    const _lastname = 'TestLastName';
    const _dateBirth = '01/01/2000';
    const _objective = 'Jubilación';

    const email = Email.createFromText(_textEmail);
    const password = Password.createFromText(_textPassword);
    const user1 = new User(
      email,
      _firstName,
      _lastname,
      _dateBirth,
      _objective,
      password
    );

    return user1;
  }

  static user2_text(): User {
    const textEmail = 'test2@test.com';
    const textPassword = 'Aabb@2';
    const firstName = 'User2Name';
    const lastname = 'TestLastName';
    const dateBirth = '01/01/2000';
    const objective = 'Jubilación';

    const email = Email.createFromText(textEmail);
    const password = Password.createFromText(textPassword);
    const user1 = new User(
      email,
      firstName,
      lastname,
      dateBirth,
      objective,
      password
    );

    return user1;
  }

  static user1_hash(): User {
    const _textEmail = 'test@test.com';
    const _textPassword = 'Aabb@1';
    const _firstName = 'User1Name';
    const _lastname = 'TestLastName';
    const _dateBirth = '01/01/2000';
    const _objective = 'Jubilación';

    const email = Email.createFromText(_textEmail);
    const password = Password.createHash(_textPassword);
    const user1 = new User(
      email,
      _firstName,
      _lastname,
      _dateBirth,
      _objective,
      password
    );

    return user1;
  }

  static user2_hash(): User {
    const textEmail = 'test2@test.com';
    const textPassword = 'Aabb@2';
    const firstName = 'User2Name';
    const lastname = 'TestLastName';
    const dateBirth = '01/01/2000';
    const objective = 'Jubilación';

    const email = Email.createFromText(textEmail);
    const password = Password.createHash(textPassword);
    const user1 = new User(
      email,
      firstName,
      lastname,
      dateBirth,
      objective,
      password
    );

    return user1;
  }

  static real_user_text(): User {
    const textEmail = 'isabelchele26@gmail.com';
    const textPassword = 'Shena@2017';
    const firstName = 'Jose Manuel';
    const lastname = 'Delgado Trueba';
    const dateBirth = '14/10/1997';
    const objective = 'Jubilación';

    const email = Email.createFromText(textEmail);
    const password = Password.createFromText(textPassword);
    const user1 = new User(
      email,
      firstName,
      lastname,
      dateBirth,
      objective,
      password
    );

    return user1;
  }

  static real_user_hash(): User {
    const textEmail = 'isabelchele26@gmail.com';
    const textPassword = 'Shena@2017';
    const firstName = 'Jose Manuel';
    const lastname = 'Delgado Trueba';
    const dateBirth = '14/10/1997';
    const objective = 'Jubilación';

    const email = Email.createFromText(textEmail);
    const password = Password.createHash(textPassword);
    const user1 = new User(
      email,
      firstName,
      lastname,
      dateBirth,
      objective,
      password
    );

    return user1;
  }
}
