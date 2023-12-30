import { TokenExample } from '@application/services/JWTService/test/Token.example';
import axios from 'axios';

describe('POST /session/revoke', () => {
  it('debe retornar un status 201 y revocar accessToken', async () => {
    const accessToken = TokenExample.accessToken();
    const body = {
      accessToken,
    };

    const res = await axios.post(`/session/revoke`, body);

    expect(res.status).toBe(201);

    let throwError;
    const response401 = {
      message: 'Access token is invalid. Please verify your credentials.',
    };

    //act
    try {
      await axios.delete(`/user/account`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.response.status).toBe(401);
    expect(throwError.response.data.message).toEqual(response401.message);
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
});
