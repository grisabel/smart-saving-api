import { Id } from './Id';
describe('La clase Id', () => {
  it('debe generar un identificador', () => {
    //act
    const result = Id.createId();

    //assert
    expect(result).toBeInstanceOf(Id);
  });
});
