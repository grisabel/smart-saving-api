import { Password, PASSWORD_ERRORS } from './Password';
describe('La clase Password', () => {
  it('debe poder instanciarse mediante un string', () => {
    //arrange
    const password = 'Aabb@1';
    //act
    const newPassword = Password.createFromText(password);
    //assert
    expect(newPassword).toBeInstanceOf(Password);
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
});
