import { Id } from './Id';
import IdService from '@application/services/IdService';
import { ID_ERRORS } from './IdError';

describe('La clase Id', () => {
  it('debe generar un identificador', () => {
    //act
    const result = Id.createId();

    //assert
    expect(result).toBeInstanceOf(Id);
    expect(IdService.isValid(result.getValue())).toEqual(true);
  });
  it('debe crear una instacia a partir de un identificador(string) existente', () => {
    //arrange
    const text = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
    //act
    const result = Id.createFrom(text);

    //assert
    expect(result).toBeInstanceOf(Id);
  });

  it('debe lanzar un error a partir de un identificador(string) inválido', () => {
    //arrange
    const text = '1234';
    let throwError;
    //act
    try {
      Id.createFrom(text);
    } catch (error) {
      throwError = error;
    }
    expect(throwError.data).toEqual({ format: ID_ERRORS.format });
  });

  it('debe comprobar si dos Id son iguales', () => {
    //arrange
    const text1 = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
    const text2 = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
    //act
    const result1 = Id.createFrom(text1);
    const result2 = Id.createFrom(text2);
    const result = result1.isEqual(result2);

    //assert
    expect(result).toEqual(true);
  });
  it('debe comprobar si dos Id son distintos', () => {
    //arrange
    const text1 = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
    const text2 = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a';
    //act
    const result1 = Id.createFrom(text1);
    const result2 = Id.createFrom(text2);
    const result = result1.isEqual(result2);

    //assert
    expect(result).toEqual(false);
  });
});
