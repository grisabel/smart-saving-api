import { AuthenticateUseCase } from './AuthenticateUseCase';
describe('La clase AuthenticationUseCase', () => {
  it('debe devolver un jwt dado un usuario y contraseña correctos', async () => {
    //arrange
    const emailDTO = 'test@test.com';
    const passwordDTO = 'Aabb@1';
    const authenticateClass = new AuthenticateUseCase();

    //act

    const result = await authenticateClass.authenticate(emailDTO, passwordDTO);

    //asert
    expect(result).toEqual('');
  });
});
