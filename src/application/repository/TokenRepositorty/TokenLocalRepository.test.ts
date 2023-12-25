import {
  TOKEN_REPOSITORY_ERROR,
  TokenInterfaceRepository,
} from './TokenInterfaceRepositoty';
import { TokenLocalRepository } from './TokenLocalRepository';
import { TokenExample } from './test/Token.example';

describe('La clase TokenLocalRepository', () => {
  let tokenRepository: TokenInterfaceRepository;

  beforeEach(() => {
    tokenRepository = new TokenLocalRepository();
  });

  it('guarda un token y comprueba si existe', () => {
    //arrange
    const token1 = TokenExample.token1();

    //act
    tokenRepository.save(token1);
    const promise = tokenRepository.find(token1);
    //assert
    expect.assertions(1);
    expect(promise).resolves.toEqual(token1);
  });

  it('comprueba que no existe el token', async () => {
    //arrange
    const token1 = TokenExample.token1();
    let throwError;
    //act
    try {
      await tokenRepository.find(token1);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect.assertions(1);
    expect(throwError.data).toEqual({
      tokenNotExist: TOKEN_REPOSITORY_ERROR.tokenNotExist,
    });
  });

  it('elimina un token', async () => {
    //arrange
    const token1 = TokenExample.token1();
    const token2 = TokenExample.token1();
    let throwError;

    //act
    tokenRepository.save(token1);
    tokenRepository.save(token2);
    tokenRepository.delete(token2);
    try {
      await tokenRepository.find(token1);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect.assertions(1);
    expect(throwError.data).toEqual({
      tokenNotExist: TOKEN_REPOSITORY_ERROR.tokenNotExist,
    });
  });

  it('lanza una excepción si se intenta eliminar un token no existente', async () => {
    //arrange
    const token1 = TokenExample.token1();
    let throwError;

    //act
    try {
      await tokenRepository.delete(token1);
    } catch (error) {
      throwError = error;
    }
    //assert
    expect.assertions(1);
    expect(throwError.data).toEqual({
      tokenNotExist: TOKEN_REPOSITORY_ERROR.tokenNotExist,
    });
  });
});
