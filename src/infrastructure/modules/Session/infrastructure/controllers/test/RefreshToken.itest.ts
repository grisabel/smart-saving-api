import { prisma } from '@application/repository/db';
import { TokenExample } from '@application/services/JWTService/test/Token.example';
import { SessionType } from '@Session/application/SessionRepository/SessionInterfaceRepository';
import axios from 'axios';

describe('POST /session/token', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });
  it('debe retornar un status 200 y un accesToken al refrescar la sesión con el refreshToken', async () => {
    const body = {
      firstName: 'User Name',
      lastName: 'User Surname',
      dateBirth: '30/01/1997',
      objetive: 'Personal Objetive',
      email: 'test@test.com',
      repeatEmail: 'test@test.com',
      password: 'Aabb@1',
      repeatPassword: 'Aabb@1',
    };
    await axios.post(`/user/register`, body);

    const resLogin = await axios.post(`/session/login`, {
      email: body.email,
      password: body.password,
    });

    const refreshTokenBody = {
      refreshToken: resLogin.data.refreshToken,
    };
    const res = await axios.post(`/session/token`, refreshTokenBody);
    expect(res.status).toBe(200);
    expect(res.data.accessToken.split('.').length).toEqual(3);
    expect(res.data.token_type).toEqual('bearer');
    expect(typeof res.data.expires).toBe('number');

    const resul = await prisma.session.findMany({
      where: {
        userEmail: body.email,
        sessionType: SessionType.Session_Refresh,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });
    expect(resul.length).toEqual(1);
    expect(resul[0].sessionType).toEqual(SessionType.Session_Refresh);
    expect(resul[0].userEmail).toEqual(body.email);
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
