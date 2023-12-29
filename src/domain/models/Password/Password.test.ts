import { Password } from './Password';
import { PASSWORD_ERRORS } from './PasswordError';
describe('La clase Password', () => {
  it('debe poder instanciarse mediante un string', () => {
    //arrange
    const password = 'Aabb@1';
    //act
    const newPassword = Password.createFromText(password);
    //assert
    expect(newPassword).toBeInstanceOf(Password);
    expect(newPassword.isHashed).toBe(false);
  });
  it('debe lanzar un error si es menor a 6 caracteres', () => {
    //arrange
    const password = 'Aab@1';
    let throwError;

    //act
    try {
      Password.createFromText(password);
    } catch (error) {
      throwError = error;
    }
    //assert
    expect(throwError.data).toEqual({ length: PASSWORD_ERRORS.length });
  });
  it('debe lanzar un error si no tiene al menos un caracter numérico', () => {
    //arrange
    const password = 'Aaabb@';
    let throwError;

    //act
    try {
      Password.createFromText(password);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.data).toEqual({ number: PASSWORD_ERRORS.number });
  });
  it('debe lanzar un error si no tiene al menos una letra mayúscula', () => {
    //arrange
    const password = 'aaabb@1';
    let throwError;

    //act
    try {
      Password.createFromText(password);
    } catch (error) {
      throwError = error;
    }
    //assert
    expect(throwError.data).toEqual({ upperCase: PASSWORD_ERRORS.upperCase });
  });

  it('debe lanzar un error si no tiene al menos una letra minúscula', () => {
    //arrange
    const password = 'AAABB@1';
    let throwError;

    //act
    try {
      Password.createFromText(password);
    } catch (error) {
      throwError = error;
    }
    //assert
    expect(throwError.data).toEqual({ lowerCase: PASSWORD_ERRORS.lowerCase });
  });

  it('debe lanzar un error si no tiene al menos un caracter especial de la siguiente lista: _ @ # !', () => {
    //arrange
    const password = 'AAAbB1';
    let throwError;

    //act
    try {
      Password.createFromText(password);
    } catch (error) {
      throwError = error;
    }
    //assert
    expect(throwError.data).toEqual({
      specialChar: PASSWORD_ERRORS.specialChar,
    });
  });
  it('si no cumple con varios requisitos, debe lanzar tantos errores como requisito no cumple', () => {
    //arrange
    const password = 'AAAAA1';
    const REQERRORS = {
      lowerCase: 'La contraseña debe contener al menos una letra minúscula.',
      specialChar:
        'La contraseña debe contener al menos alguno de los siguientes caracteres: _ @ # !',
    };

    //act
    try {
      Password.createFromText(password);
    } catch (error) {
      //assert
      expect(error.data).toEqual(REQERRORS);
    }
  });
  it('debe identificar si dos contraseñas coinciden', () => {
    //arrange
    const text1 = 'Aabb@1';
    const text2 = 'Aabb@1';

    //act
    const password1 = Password.createFromText(text1);
    const password2 = Password.createFromText(text2);
    const result = password1.isEqual(password2);
    //assert
    expect(result).toEqual(true);
  });
  it('debe identificar si dos contraseñas no coinciden', () => {
    //arrange
    const text1 = 'Aabb@1';
    const text2 = 'Aabb@2';

    //act
    const password1 = Password.createFromText(text1);
    const password2 = Password.createFromText(text2);
    const result = password1.isEqual(password2);
    //assert
    expect(result).toEqual(false);
  });
  it('debe generar el hash correctamente', () => {
    //arrange
    const text1 = 'Aabb@1';

    //act
    const password1 = Password.createFromText(text1);
    const result = password1.hash();
    //assert
    expect(result).not.toBe(text1);
    expect(result.length).toBe(64);
    expect(/^[a-fA-F0-9]{64}$/.test(result)).toBe(true);
  });
  it('debe poder instanciarse mediante un hash', () => {
    //arrange
    const hash =
      '82597e3c864f7fb8abe635d8033ef021339e4005ba82a13b83d1ab6fdde37f9a';
    //act
    const passwordHashed = Password.createHash(hash);
    //assert
    expect(passwordHashed).toBeInstanceOf(Password);
    expect(passwordHashed.isHashed).toBe(true);
  });
});
