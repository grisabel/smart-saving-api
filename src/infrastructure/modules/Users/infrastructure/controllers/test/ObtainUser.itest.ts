import { prisma } from '@application/repository/db';
import { TokenExample } from '@application/services/JWTService/test/Token.example';
import axios from 'axios';

describe('POST /user/info', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });
  it('debe retornar un status 200 y la información del usuario', async () => {
    const body = {
      firstName: 'User Name',
      lastName: 'User Surname',
      dateBirth: '30/01/1997',
      objetive: 'Personal Objetive',
      email: 'user@email.com',
      repeatEmail: 'user@email.com',
      password: '12345@Aa',
      repeatPassword: '12345@Aa',
    };
    await axios.post(`/user/register`, body);

    const resLogin = await axios.post(`/session/login`, {
      email: body.email,
      password: body.password,
    });

    const res = await axios.get(`/user/info`, {
      headers: {
        Authorization: `Bearer ${resLogin.data.accessToken}`,
      },
    });

    expect(res.status).toEqual(200);
    expect(res.data.firstName).toEqual(body.firstName);
    expect(res.data.lastName).toEqual(body.lastName);
    expect(res.data.dateBirth).toEqual(body.dateBirth);
    expect(res.data.objective).toEqual(body.objetive);
    expect(res.data.email).toEqual(body.email);
  });
  it('debe retornar un 401 si la petición no esta autenticada', async () => {
    let throwError;
    try {
      await axios.get(`/user/info`);
    } catch (error) {
      throwError = error;
    }

    expect(throwError.response.status).toEqual(401);
  });
});
// TODO añadir error generico
