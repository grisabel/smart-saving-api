import { Password, ERRORS } from './Password';
describe('La clase Password', () => {
  it('debe poder instanciarse mediante un string', () => {
    //arrange
    const password = 'Aabb@1';
    //act
    const newPassword = new Password(password);
    //assert
    expect(newPassword).toBeInstanceOf(Password);
  });
  it('debe lanzar un error si es menor a 6 caracteres', () => {
    //arrange
    const password = 'Aab@1';

    //assert
    expect(() => {
      new Password(password);
    }).toThrow(ERRORS.length);
  });
  it('debe lanzar un error si no tiene al menos un caracter numérico', () => {
    //arrange
    const password = 'Aaabb@';

    //assert
    expect(() => {
      new Password(password);
    }).toThrow(ERRORS.number);
  });
  it('debe lanzar un error si no tiene al menos una letra mayúscula', () => {
    //arrange
    const password = 'aaabb@1';

    //assert
    expect(() => {
      new Password(password);
    }).toThrow(ERRORS.upperCase);
  });

  it('debe lanzar un error si no tiene al menos una letra minúscula', () => {
    //arrange
    const password = 'AAABB@1';

    //assert
    expect(() => {
      new Password(password);
    }).toThrow(ERRORS.lowerCase);
  });

  it('debe lanzar un error si no tiene al menos un caracter especial de la siguiente lista: _ @ # !', () => {
    //arrange
    const password = 'AAAbB1';

    //assert
    expect(() => {
      new Password(password);
    }).toThrow(ERRORS.specialChar);
  });
});
