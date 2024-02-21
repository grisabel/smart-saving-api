import { UserLocalRepository } from '../UserLocalRepository';
import {
  USER_REPOSITORY_ERROR,
  UserInterfaceRepository,
} from '../UserInterfaceRepository';
import { UserExample } from '@domain/models/User/test/User.example';
import { Password } from '@domain/models/Password';
import HashService from '@application/services/HashService';
import { UserFactoryRepository } from '../UserFactoryRepository';
import { prisma } from '@application/repository/db';

describe('La clase UserSqlRepository', () => {
  let userRepository = UserFactoryRepository.getInstance();

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('guarda un usuario y comprueba si existe', async () => {
    //arrange
    const user1 = UserExample.user1_text();
    const user1Hased = UserExample.user1_hash();

    //act
    await userRepository.save(user1);
    const user = await userRepository.findByEmail(user1.getEmail());
    //assert
    expect(user).toEqual(user1Hased);
  });

  it('comprueba que no existe el usuario por email', async () => {
    //arrange
    const user1 = UserExample.user1_text();
    let throwError;
    //act
    try {
      await userRepository.findByEmail(user1.getEmail());
    } catch (error) {
      throwError = error;
    }

    //assert
    expect.assertions(1);
    expect(throwError.data).toEqual({
      userNotExist: USER_REPOSITORY_ERROR.userNotExist,
    });
  });

  it('guarda varios usuarios y obtiene todos', async () => {
    //arrange
    const user1 = UserExample.user1_text();
    const user1Hased = UserExample.user1_hash();
    const user2 = UserExample.user2_text();
    const user2Hased = UserExample.user2_hash();

    //act
    await userRepository.save(user1);
    await userRepository.save(user2);

    const users = await userRepository.findAll();

    //assert
    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining(user1Hased),
        expect.objectContaining(user2Hased),
      ])
    );
  });

  it('obtiene un array vacio si no se han guardado usuarios', async () => {
    const users = await userRepository.findAll();
    //assert
    expect(users).toEqual([]);
  });

  //todo
  // it('elimina un usuario', async () => {
  //   //arrange
  //   const user1 = UserExample.user1_text();
  //   const user1Hased = UserExample.user1_hash();
  //   const user2 = UserExample.user2_text();

  //   //act
  //   await userRepository.save(user1);
  //   await userRepository.save(user2);
  //   await userRepository.delete(user2.getEmail());
  //   const users = await userRepository.findAll();
  //   //assert

  //   expect(users).toEqual([user1Hased]);
  // });

  it('lanza una excepción si se intenta eliminar un usuario no existente', async () => {
    //arrange
    const user1 = UserExample.user1_text();
    let throwError;

    //act
    try {
      await userRepository.delete(user1.getEmail());
    } catch (error) {
      throwError = error;
    }
    //assert
    expect.assertions(1);
    expect(throwError.data).toEqual({
      userNotExist: USER_REPOSITORY_ERROR.userNotExist,
    });
  });

  it('actualiza un usuario existente', async () => {
    //arrange
    const user1 = UserExample.user1_text();
    const newPwd = 'Aabb@1UpdateRepository';
    //act
    await userRepository.save(user1);
    const pwd = Password.createFromText(newPwd);
    user1.changePassword(pwd);

    await userRepository.update(user1);

    const updatedUser = await userRepository.findByEmail(user1.getEmail());
    //assert
    expect(updatedUser.getPassword().getValue()).toEqual(
      HashService.generateHash(newPwd)
    );
  });

  it('lanza una excepción si se intenta actualizar un usuario no existente', async () => {
    //arrange
    const user1 = UserExample.user1_text();
    const pwd = Password.createFromText('Aabb@1UpdateRepository');
    user1.changePassword(pwd);

    let throwError;
    //act
    try {
      await userRepository.update(user1);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect.assertions(1);
    expect(throwError.data).toEqual({
      userNotExist: USER_REPOSITORY_ERROR.userNotExist,
    });
  });
});
