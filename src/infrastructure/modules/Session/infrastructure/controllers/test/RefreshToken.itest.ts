import { TokenExample } from '@application/services/JWTService/test/Token.example';
import axios from 'axios';

describe('POST /session/token', () => {
  it('debe retornar un status 200 y un accesToken al refrescar la sesión con el refreshToken', async () => {
    const bodyLogin = {
      email: 'test@test.com',
      password: 'Aabb@1',
    };

    const resLogin = await axios.post(`/session/login`, bodyLogin);

    const refreshTokenBody = {
      refreshToken: resLogin.data.refreshToken,
    };
    const res = await axios.post(`/session/token`, refreshTokenBody);
    expect(res.status).toBe(200);
    expect(res.data.accessToken.split('.').length).toEqual(3);
    expect(res.data.token_type).toEqual('bearer');
    expect(typeof res.data.expires).toBe('number');
  });
  it('debe retornar un status 422 si el formato de la petición no es válido', async () => {
    const body = {};
    let throwError;
    const response422 = {
      message: 'Validación incorrecta',
      errors: [{ path: 'refreshToken' }],
    };

    //act
    try {
      await axios.post(`/session/token`, body);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.response.status).toBe(422);
    expect(throwError.response.data.message).toEqual(response422.message);
    expect(throwError.response.data.errors).toEqual(
      expect.arrayContaining([expect.objectContaining(response422.errors[0])])
    );
  });
  it('debe retornar un status 401 si el refresh token es inválido', async () => {
    const body = {
      refreshToken: TokenExample.invalidToken(),
    };
    let throwError;
    const response401 = {
      message: 'Invalid Refresh Token',
    };

    //act
    try {
      await axios.post(`/session/token`, body);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.response.status).toBe(401);
    expect(throwError.response.data.message).toEqual(response401.message);
  });
});
