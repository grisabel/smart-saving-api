import { prisma } from '@application/repository/db';
import { TokenExample } from '@application/services/JWTService/test/Token.example';
import {
  SessionReasonType,
  SessionType,
} from '@infrastructure/modules/Session/application/SessionRepository/SessionInterfaceRepository';
import axios from 'axios';

describe('POST /session/logout', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.session.deleteMany();
  });
  it('debe retornar un status 201', async () => {
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

    const bodyLogout = {
      refreshToken: resLogin.data.refreshToken,
    };
    const res = await axios.post(`/session/logout`, bodyLogout, {
      headers: {
        Authorization: `Bearer ${resLogin.data.accessToken}`,
      },
    });
    expect(res.status).toBe(201);

    const resul = await prisma.session.findMany({
      where: {
        userEmail: body.email,
        sessionType: SessionType.Session_End,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });
    expect(resul.length).toEqual(1);
    expect(resul[0].sessionType).toEqual(SessionType.Session_End);
    expect(resul[0].userEmail).toEqual(body.email);
    expect(resul[0].reason).toEqual(SessionReasonType.Session_User_Logout);
  });
  it('debe retornar un status 422 si el formato de la petición no es válido', async () => {
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
    const bodyLogout = {};
    let throwError;
    const response422 = {
      message: 'Validación incorrecta',
      errors: [{ path: 'refreshToken' }],
    };

    //act
    try {
      await axios.post(`/user/register`, body);

      const resLogin = await axios.post(`/session/login`, {
        email: body.email,
        password: body.password,
      });

      await axios.post(`/session/logout`, bodyLogout, {
        headers: {
          Authorization: `Bearer ${resLogin.data.accessToken}`,
        },
      });
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
