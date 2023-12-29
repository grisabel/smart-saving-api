import { Id } from '@domain/models/Id/Id';
import {
  OPERATIONSID_REPOSITORY_ERROR,
  OperationsIdInterfaceRepository,
} from '../OperationIdInterfaceRepository';
import { OperationsIdLocalRepository } from '../OperationsIdLocalRepository';
import { OperationExample } from './OperationExample';
describe('La clase OperationIdRepository', () => {
  let operationIdRepository: OperationsIdInterfaceRepository;

  beforeEach(() => {
    operationIdRepository = new OperationsIdLocalRepository();
  });

  it('guarda un operation y comprueba si existe', async () => {
    //arrange
    const operation = OperationExample.operationResetPassword();

    //act
    await operationIdRepository.save(operation);
    const resul = await operationIdRepository.find(Id.createFrom(operation.id));
    //assert
    expect.assertions(1);
    expect(resul).toEqual(operation);
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
    const operation = OperationExample.operationResetPassword();
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
