import { UserLocalRepository } from '../UserLocalRepository';
import {
  USER_REPOSITORY_ERROR,
  UserInterfaceRepository,
} from '../UserInterfaceRepository';
import { UserExample } from '@domain/models/User/test/User.example';
import { Password } from '@domain/models/Password';
import HashService from '@application/services/HashService';

describe('La clase UserLocalRepository', () => {
  let userRepository: UserInterfaceRepository;

  beforeEach(() => {
    userRepository = new UserLocalRepository();
  });

  it('guarda un usuario y comprueba si existe', () => {
    //arrange
    const user1 = UserExample.user1_text();
    const user1Hased = UserExample.user1_hash();

    //act
    userRepository.save(user1);
    const promise = userRepository.findByEmail(user1.getEmail());
    //assert
    expect.assertions(1);
    expect(promise).resolves.toEqual(user1Hased);
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

  it('guarda varios usuarios y obtiene todos', () => {
    //arrange
    const user1 = UserExample.user1_text();
    const user1Hased = UserExample.user1_hash();
    const user2 = UserExample.user2_text();
    const user2Hased = UserExample.user2_hash();

    //act
    userRepository.save(user1);
    userRepository.save(user2);
    const promise = userRepository.findAll();
    //assert
    expect.assertions(1);
    expect(promise).resolves.toEqual([user1Hased, user2Hased]);
  });

  it('obtiene un array vacio si no se han guardado usurios', () => {
    const promise = userRepository.findAll();
    //assert
    expect.assertions(1);
    expect(promise).resolves.toEqual([]);
  });

  it('elimina un usuario', () => {
    //arrange
    const user1 = UserExample.user1_text();
    const user1Hased = UserExample.user1_hash();
    const user2 = UserExample.user2_text();

    //act
    userRepository.save(user1);
    userRepository.save(user2);
    userRepository.delete(user2.getEmail());
    const promise = userRepository.findAll();
    //assert
    expect.assertions(1);
    expect(promise).resolves.toEqual([user1Hased]);
  });

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
    userRepository.save(user1);
    const pwd = Password.createFromText(newPwd);
    user1.changePassword(pwd);

    userRepository.update(user1);

    const updatedUser = await userRepository.findByEmail(user1.getEmail());
    //assert
    expect.assertions(1);
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
