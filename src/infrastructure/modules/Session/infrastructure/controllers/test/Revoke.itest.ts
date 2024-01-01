import { prisma } from '@application/repository/db';
import axios from 'axios';

describe('POST /session/revoke', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.revokeAccessToken.deleteMany();
  });
  it('debe retornar un status 201 y revocar accessToken', async () => {
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

    const res = await axios.post(
      `/session/revoke`,
      {
        accessToken: resLogin.data.accessToken,
      },
      {
        headers: {
          Authorization: `Bearer ${resLogin.data.accessToken}`,
        },
      }
    );

    expect(res.status).toBe(201);

    let throwError;
    const response401 = {
      message: 'Access token is invalid. Please verify your credentials.',
    };

    //act
    try {
      await axios.delete(`/user/account`, {
        headers: {
          Authorization: `Bearer ${resLogin.data.accessToken}`,
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
      errors: [{ path: 'accessToken' }],
    };

    //act
    try {
      await axios.post(`/user/register`, body);

      const resLogin = await axios.post(`/session/login`, {
        email: body.email,
        password: body.password,
      });

      await axios.post(`/session/revoke`, bodyLogout, {
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
