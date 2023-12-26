import { TokenExample } from '@application/services/JWTService/test/Token.example';
import axios from 'axios';

describe('POST /user/login', () => {
  it('debe retornar un status 200 y un accesToken al refrescar la sesión con el refreshToken', async () => {
    const bodyLogin = {
      email: 'test@test.com',
      password: 'Aabb@1',
    };

    const resLogin = await axios.post(`/user/login`, bodyLogin);

    const refreshTokenBody = {
      refreshToken: resLogin.data.refreshToken,
    };
    const res = await axios.post(`/user/refreshToken`, refreshTokenBody);
    expect(res.status).toBe(200);
    expect(res.data.accessToken.split('.').length).toEqual(3);
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
      await axios.post(`/user/refreshToken`, body);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.response.status).toBe(401);
    expect(throwError.response.data.message).toEqual(response401.message);
  });
});
