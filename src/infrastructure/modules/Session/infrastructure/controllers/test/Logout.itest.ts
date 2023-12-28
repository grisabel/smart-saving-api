import { TokenExample } from '@application/services/JWTService/test/Token.example';
import axios from 'axios';

describe('POST /session/logout', () => {
  it('debe retornar un status 201 y al eliminar un refreshToken', async () => {
    const bodyLogin = {
      email: 'test@test.com',
      password: 'Aabb@1',
    };

    const resLogin = await axios.post(`/session/login`, bodyLogin);

    const bodyLogout = {
      refreshToken: resLogin.data.refreshToken,
    };
    const res = await axios.post(`/session/logout`, bodyLogout);
    expect(res.status).toBe(201);
  });
  it('debe retornar un status 422 si el formato de la petición no es válido', async () => {
    const bodyLogout = {};
    let throwError;
    const response422 = {
      message: 'Validación incorrecta',
      errors: [{ path: 'refreshToken' }],
    };

    //act
    try {
      await axios.post(`/session/logout`, bodyLogout);
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
  it('debe retornar un status 404 si el refresh token no existe', async () => {
    const refreshToken = TokenExample.invalidToken();
    const bodyLogout = {
      refreshToken,
    };

    let throwError;
    const response404 = {
      message: 'Invalid Refresh Token',
    };

    //act
    try {
      await axios.post(`/session/logout`, bodyLogout);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.response.status).toBe(404);
    expect(throwError.response.data.message).toEqual(response404.message);
  });
});
