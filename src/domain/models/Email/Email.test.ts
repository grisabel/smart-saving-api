import { Email } from './Email';
import { EmailError } from './EmailError';
describe('La clase Email', () => {
  it('debe poder instanciarse mediante un string', () => {
    //arrange
    const text: string = 'test@test.com';

    //act
    const email = Email.createFromText(text);

    //assert
    expect(email).toBeInstanceOf(Email);
  });
  it('debe lanzar un error en caso de que el email no tenga nada antes del @', () => {
    //arrange
    const text: string = '@test.com';
    let throwError;
    //act
    try {
      const email = Email.createFromText(text);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.message).toEqual(EmailError.msg);
  });
  it('debe lanzar un error en caso de que el email no tenga @', () => {
    //arrange
    const text: string = 'test.com';
    let throwError;
    //act
    try {
      const email = Email.createFromText(text);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.message).toEqual(EmailError.msg);
  });
  it('debe lanzar un error en caso de que el dominio del email tenga menos de dos caracteres después del punto', () => {
    //arrange
    const text: string = 'test@test.c';
    let throwError;
    //act
    try {
      const email = Email.createFromText(text);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.message).toEqual(EmailError.msg);
  });
  it('debe lanzar un error en caso de que el dominio del email no tenga el punto', () => {
    //arrange
    const text: string = 'test@testcom';
    let throwError;
    //act
    try {
      const email = Email.createFromText(text);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.message).toEqual(EmailError.msg);
  });
  it('debe lanzar un error en caso de que el dominio del email no tenga caracteres antes del punto', () => {
    //arrange
    const text: string = 'test@.com';
    let throwError;
    //act
    try {
      const email = Email.createFromText(text);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.message).toEqual(EmailError.msg);
  });
});
