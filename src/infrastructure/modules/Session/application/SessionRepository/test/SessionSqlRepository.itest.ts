import { prisma } from '@application/repository/db';

import { SessionFactoryRepository } from '../SessionFactoryRepository';
import { SessionReasonType, SessionType } from '../SessionInterfaceRepository';
import { UserExample } from '@domain/models/User/test/User.example';
import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';

describe('La clase SessionSqlRepository', () => {
  const sessionRepository = SessionFactoryRepository.getInstance();
  const userRepository = UserFactoryRepository.getInstance();

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.session.deleteMany();
  });

  it('debe almacernar el inicio de una sesión exitosa', async () => {
    //arange
    const user = UserExample.real_user_text();
    const email = user.getEmail();

    const ip = '69.89.31.226';

    const expiresIn = new Date().getTime() + 24 * 60 * 60 * 1000;

    const isLoginSuccess = true;

    //act
    await userRepository.save(user);
    await sessionRepository.saveSessionStart(
      email,
      ip,
      `${expiresIn}`,
      isLoginSuccess
    );

    //assert
    const resul = await prisma.session.findMany({
      where: {
        userEmail: email.getValue(),
        sessionType: SessionType.Session_Start,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    expect(resul.length).toEqual(1);
    expect(resul[0].sessionType).toEqual(SessionType.Session_Start);
    expect(resul[0].userEmail).toEqual(email.getValue());
    expect(resul[0].ip).toEqual(ip);
    expect(resul[0].expiresIn.getTime()).toEqual(expiresIn);
    expect(resul[0].failuresNumber).toEqual(0);
  });

  it('debe almacernar el inicio de una sesión fallida', async () => {
    //arange
    const user = UserExample.real_user_text();
    const email = user.getEmail();

    const ip = '69.89.31.226';

    const expiresIn = new Date().getTime() + 24 * 60 * 60 * 1000;

    const isLoginSuccess = false;

    //act
    await userRepository.save(user);
    await sessionRepository.saveSessionStart(
      email,
      ip,
      `${expiresIn}`,
      isLoginSuccess
    );

    //assert
    const resul = await prisma.session.findMany({
      where: {
        userEmail: email.getValue(),
        sessionType: SessionType.Session_Start,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    expect(resul.length).toEqual(1);
    expect(resul[0].sessionType).toEqual(SessionType.Session_Start);
    expect(resul[0].userEmail).toEqual(email.getValue());
    expect(resul[0].ip).toEqual(ip);
    expect(resul[0].expiresIn.getTime()).toEqual(expiresIn);
    expect(resul[0].failuresNumber).toEqual(1);
  });

  it('debe almacernar el inicio de una sesión fallida y el numero de intentos fallidos', async () => {
    //arange
    const user = UserExample.real_user_text();
    const email = user.getEmail();

    const ip = '69.89.31.226';

    const isLoginSuccess = false;

    //act
    await userRepository.save(user);
    await sessionRepository.saveSessionStart(
      email,
      ip,
      `${new Date().getTime() + 24 * 60 * 60 * 1000}`,
      isLoginSuccess
    );
    await sessionRepository.saveSessionStart(
      email,
      ip,
      `${new Date().getTime() + 24 * 60 * 60 * 1000}`,
      isLoginSuccess
    );
    await sessionRepository.saveSessionStart(
      email,
      ip,
      `${new Date().getTime() + 24 * 60 * 60 * 1000}`,
      isLoginSuccess
    );

    //assert
    const resul = await prisma.session.findMany({
      where: {
        userEmail: email.getValue(),
        sessionType: SessionType.Session_Start,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    expect(resul.length).toEqual(1);
    expect(resul[0].sessionType).toEqual(SessionType.Session_Start);
    expect(resul[0].failuresNumber).toEqual(3);
  });

  it('debe almacernar el refresco de una sesión exitosa', async () => {
    //arange
    const user = UserExample.real_user_text();
    const email = user.getEmail();

    const ip = '69.89.31.226';

    const expiresIn = new Date().getTime() + 24 * 60 * 60 * 1000;

    //act
    await userRepository.save(user);
    await sessionRepository.saveSessionRefresh(email, ip, `${expiresIn}`);

    //assert
    const resul = await prisma.session.findMany({
      where: {
        userEmail: email.getValue(),
        sessionType: SessionType.Session_Refresh,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    expect(resul.length).toEqual(1);
    expect(resul[0].sessionType).toEqual(SessionType.Session_Refresh);
    expect(resul[0].userEmail).toEqual(email.getValue());
    expect(resul[0].ip).toEqual(ip);
    expect(resul[0].expiresIn.getTime()).toEqual(expiresIn);
  });

  it('debe almacernar una sesión cerrada por el usuario', async () => {
    //arange
    const user = UserExample.real_user_text();
    const email = user.getEmail();

    const ip = '69.89.31.226';

    const expiresIn = new Date().getTime() + 24 * 60 * 60 * 1000;

    //act
    await userRepository.save(user);
    await sessionRepository.saveSessionEnd(
      email,
      ip,
      `${expiresIn}`,
      SessionReasonType.Session_User_Logout
    );

    //assert
    const resul = await prisma.session.findMany({
      where: {
        userEmail: email.getValue(),
        sessionType: SessionType.Session_End,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    expect(resul.length).toEqual(1);
    expect(resul[0].sessionType).toEqual(SessionType.Session_End);
    expect(resul[0].userEmail).toEqual(email.getValue());
    expect(resul[0].ip).toEqual(ip);
    expect(resul[0].expiresIn.getTime()).toEqual(expiresIn);
    expect(resul[0].reason).toEqual(SessionReasonType.Session_User_Logout);
  });

  it('debe almacernar una sesión cerrada por expiración de las session', async () => {
    //arange
    const user = UserExample.real_user_text();
    const email = user.getEmail();

    const ip = '69.89.31.226';

    const expiresIn = new Date().getTime();

    //act
    await userRepository.save(user);
    await sessionRepository.saveSessionEnd(
      email,
      ip,
      `${expiresIn}`,
      SessionReasonType.Session_Token_Expired
    );

    //assert
    const resul = await prisma.session.findMany({
      where: {
        userEmail: email.getValue(),
        sessionType: SessionType.Session_End,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    expect(resul.length).toEqual(1);
    expect(resul[0].sessionType).toEqual(SessionType.Session_End);
    expect(resul[0].userEmail).toEqual(email.getValue());
    expect(resul[0].ip).toEqual(ip);
    expect(resul[0].expiresIn.getTime()).toEqual(expiresIn);
    expect(resul[0].reason).toEqual(SessionReasonType.Session_Token_Expired);
  });
});
