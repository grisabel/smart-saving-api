import { TokenExample } from '@application/services/JWTService/test/Token.example';
import {
  TOKEN_REPOSITORY_ERROR,
  RevokeAccessTokenInterfaceRepository,
} from '../TokenInterfaceRepositoty';
import { TokenLocalRepository } from '../TokenLocalRepository';
import { TokenFactoryRepository } from '../TokenFactoryRepository';
import { prisma } from '@application/repository/db';

describe('La clase TokenSqlRepository', () => {
  let tokenRepository = TokenFactoryRepository.getInstance();

  beforeEach(async () => {
    await prisma.revokeAccessToken.deleteMany();
  });

  it('guarda un token y comprueba si existe', async () => {
    //arrange
    const token1 = TokenExample.token1();

    //act
    await tokenRepository.save(token1);
    const token = await tokenRepository.find(token1);
    //assert
    expect(token).toEqual(token1);
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
    expect(throwError.data).toEqual({
      tokenNotExist: TOKEN_REPOSITORY_ERROR.tokenNotExist,
    });
  });

  it('elimina un token', async () => {
    //arrange
    const token1 = TokenExample.token1();
    const token2 = TokenExample.token2();
    let throwError;

    //act
    await tokenRepository.save(token1);
    await tokenRepository.save(token2);
    await tokenRepository.delete(token2);
    try {
      await tokenRepository.find(token2);
    } catch (error) {
      throwError = error;
    }

    //assert
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
    expect(throwError.data).toEqual({
      tokenNotExist: TOKEN_REPOSITORY_ERROR.tokenNotExist,
    });
  });
});
