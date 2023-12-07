import { Id } from './Id';
describe('La clase Id', () => {
  it('debe generar un identificador', () => {
    //act
    const result = Id.createId();

    //assert
    expect(result).toBeInstanceOf(Id);
  });
  it('debe crear una instacia a partir de un identificador(string) existente', () => {
    //arrange
    const text = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
    //act
    const result = Id.createFrom(text);

    //assert
    expect(result).toBeInstanceOf(Id);
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
