import { prisma } from '@application/repository/db';
import { SessionType } from '@Session/application/SessionRepository/SessionInterfaceRepository';
import axios from 'axios';

describe('POST /session/login', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('debe retornar un status 200 y un accesToken al loguear un usuario satisfactoriamente', async () => {
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

    const res = await axios.post(`/session/login`, {
      email: body.email,
      password: body.password,
    });

    expect(res.status).toBe(200);
    expect(res.data.accessToken.split('.').length).toEqual(3);
    expect(res.data.refreshToken.split('.').length).toEqual(3);
    expect(res.data.token_type).toEqual('bearer');
    expect(typeof res.data.expires).toBe('number');

    const resul = await prisma.session.findMany({
      where: {
        userEmail: body.email,
        sessionType: SessionType.Session_Start,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });
    expect(resul.length).toEqual(1);
    expect(resul[0].sessionType).toEqual(SessionType.Session_Start);
    expect(resul[0].userEmail).toEqual(body.email);
    expect(resul[0].failuresNumber).toEqual(0);
  });
  it('debe retornar un status 422 si el body está incompleto', async () => {
    //arrange
    const body = {};
    let throwError;
    const response422 = {
      message: 'Validación incorrecta',
      errors: [{ path: 'email' }, { path: 'password' }],
    };

    //act
    try {
      await axios.post(`/session/login`, body);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.response.status).toBe(422);
    expect(throwError.response.data.message).toEqual(response422.message);
    expect(throwError.response.data.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining(response422.errors[0]),
        expect.objectContaining(response422.errors[1]),
      ])
    );
  });
  it('debe retornar un status 401 si el usuario no existe', async () => {
    const body = {
      email: 'test@test2.com',
      password: 'Aabb@12',
    };
    
    let throwError;
    const response401 = {
      message: 'Usuario o contraseña incorrectos',
    };

    //act
    try {
      await axios.post(`/session/login`, body);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.response.status).toBe(401);
    expect(throwError.response.data.message).toEqual(response401.message);
  });
  it('debe retornar un status 401 si la contrasña no coincide', async () => {
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

    let throwError;
    const response401 = {
      message: 'Usuario o contraseña incorrectos',
    };

    //act
    await axios.post(`/user/register`, body);

    try {
      await axios.post(`/session/login`, {
        email: body.email,
        password: 'Aabb@2',
      });
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.response.status).toBe(401);
    expect(throwError.response.data.message).toEqual(response401.message);

    const resul = await prisma.session.findMany({
      where: {
        userEmail: body.email,
        sessionType: SessionType.Session_Start,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });
    expect(resul.length).toEqual(1);
    expect(resul[0].sessionType).toEqual(SessionType.Session_Start);
    expect(resul[0].userEmail).toEqual(body.email);
    expect(resul[0].failuresNumber).toEqual(1);
  });
});
