import { Password } from '../../Password';
import { User } from '../User';
import { USER_ERRORS } from '../UserError';
import { UserExample } from './User.example';

describe('La clase usuario', () => {
  it('puede generar una instacia a través de su constructor', () => {
    expect(UserExample.user1()).toBeInstanceOf(User);
  });

  it('debe determinar si dos usuarios son el mismo', () => {
    const user1 = UserExample.user1();
    const user2 = UserExample.user1();

    const result = user1.isEqual(user2);

    //assert
    expect(result).toEqual(true);
  });

  it('debe determinar si dos usuarios son distintos', () => {
    //arange
    const user1 = UserExample.user1();
    const user2 = UserExample.user2();

    //act
    const result = user1.isEqual(user2);

    //assert
    expect(result).toEqual(false);
  });

  it('puede cambiar la contraseña', () => {
    //arange
    const textNewPassword = 'Aabb@2';
    const newPassword = Password.createFromText(textNewPassword);
    const user = UserExample.user1();

    //act;
    user.changePassword(newPassword);
    const result = user.getPassword();

    //assert
    expect(result).toEqual(newPassword);
  });

  it('puede detectar si dos contraseñas son iguales y por tanto no puede ser cambiada', () => {
    //arange
    const user = UserExample.user1();
    const newPassword = Password.createFromText(user.getPassword().getValue());

    //act
    let throwError;

    try {
      user.changePassword(newPassword);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.data).toEqual({ samePassword: USER_ERRORS.samePassword });
  });
});
