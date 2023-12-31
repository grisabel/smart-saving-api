import { Id } from '@domain/models/Id/Id';
import { OPERATIONSID_REPOSITORY_ERROR } from '../OperationIdInterfaceRepository';

import { OperationExample } from './OperationExample';
import { OperationsIdFactoryRepository } from '../OperationsIdFactoryRepository';
import { prisma } from '@application/repository/db';
import { UserExample } from '@domain/models/User/test/User.example';
import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';
import { USER_REPOSITORY_ERROR } from '@application/repository/UserRepository/UserInterfaceRepository';

describe('La clase OperationIdSqlRepository', () => {
  let operationIdRepository = OperationsIdFactoryRepository.getInstance();
  let userRepository = UserFactoryRepository.getInstance();

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.operation.deleteMany();
  });

  it('guarda un operation y comprueba si existe', async () => {
    //arrange
    const user = UserExample.real_user_text();
    const operation = OperationExample.operationResetPassword();

    //act
    await userRepository.save(user);
    await operationIdRepository.save(operation);
    const resul = await operationIdRepository.find(Id.createFrom(operation.id));
    //assert
    expect.assertions(1);
    expect(resul).toEqual(operation);
  });

  it('debe lanzar una excepción si guarda una operación a un usuario no existente', async () => {
    //arrange
    const operation = OperationExample.operationResetPassword();
    let throwError;

    //act
    try {
      await operationIdRepository.save(operation);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.data).toEqual({
      userNotExist: USER_REPOSITORY_ERROR.userNotExist,
    });
  });

  it('debe lanzar una excepción si guarda una operación con un mismo id', async () => {
    //arrange
    const user = UserExample.real_user_text();

    const operation = OperationExample.operationResetPassword();
    let throwError;

    //act
    try {
      await userRepository.save(user);
      await operationIdRepository.save(operation);
      await operationIdRepository.save(operation);
    } catch (error) {
      throwError = error;
    }

    //assert
    expect(throwError.data).toEqual({
      idDuplicate: OPERATIONSID_REPOSITORY_ERROR.idDuplicate,
    });
  });

  it('comprueba que no existe un operation', async () => {
    //arrange
    const operation = OperationExample.operationResetPassword();
    let throwError;
    //act
    try {
      await operationIdRepository.find(Id.createFrom(operation.id));
    } catch (error) {
      throwError = error;
    }

    //assert
    expect.assertions(1);
    expect(throwError.data).toEqual({
      idNotExist: OPERATIONSID_REPOSITORY_ERROR.idNotExist,
    });
  });

  it('elimina un operation', async () => {
    //arrange
    const user = UserExample.real_user_text();
    const operation = OperationExample.operationResetPassword();

    //act
    await userRepository.save(user);
    let throwError;

    //act
    await operationIdRepository.save(operation);
    await operationIdRepository.delete(Id.createFrom(operation.id));

    try {
      await operationIdRepository.find(Id.createFrom(operation.id));
    } catch (error) {
      throwError = error;
    }

    //assert
    expect.assertions(1);
    expect(throwError.data).toEqual({
      idNotExist: OPERATIONSID_REPOSITORY_ERROR.idNotExist,
    });
  });

  it('lanza una excepción si se intenta eliminar un operation no existente', async () => {
    //arrange
    const operation = OperationExample.operationResetPassword();
    let throwError;

    //act
    try {
      await operationIdRepository.delete(Id.createFrom(operation.id));
    } catch (error) {
      throwError = error;
    }

    //assert
    expect.assertions(1);
    expect(throwError.data).toEqual({
      idNotExist: OPERATIONSID_REPOSITORY_ERROR.idNotExist,
    });
  });
});
