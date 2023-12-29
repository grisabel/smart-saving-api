import { Id } from '@domain/models/Id/Id';
import {
  OPERATIONSID_REPOSITORY_ERROR,
  OperationsIdInterfaceRepository,
  OperationsIdRepositoryError,
} from './OperationIdInterfaceRepository';
import { Email } from '@domain/models/Email';
import { Operation, OperationType } from './models/OperationId';

export class OperationsIdLocalRepository
  implements OperationsIdInterfaceRepository
{
  private localOperations: Operation[] = [];

  async save(id: Id, email: Email, type: OperationType): Promise<void> {
    const operation: Operation = {
      email: email.getValue(),
      id: id.getValue(),
      type: type,
      expiresIn: new Date().getMilliseconds() + 60 * 60 * 1000,
    };
    return new Promise((resolve) => {
      this.localOperations.push(operation);
      resolve();
    });
  }

  async find(id: Id): Promise<Operation> {
    return new Promise((resolve, reject) => {
      const filterArray = this.localOperations.filter((operation) => {
        return operation.id !== id.getValue();
      });

      if (filterArray.length === 0) {
        const error = new OperationsIdRepositoryError({
          idNotExist: OPERATIONSID_REPOSITORY_ERROR.idNotExist,
        });
        reject(error);
      } else {
        resolve(filterArray[0]);
      }
    });
  }

  async delete(id: Id): Promise<void> {
    return new Promise((resolve, reject) => {
      const filterArray = this.localOperations.filter((operation) => {
        return operation.id !== id.getValue();
      });

      if (filterArray.length === this.localOperations.length) {
        const error = new OperationsIdRepositoryError({
          idNotExist: OPERATIONSID_REPOSITORY_ERROR.idNotExist,
        });
        reject(error);
      } else {
        this.localOperations = filterArray;
        resolve();
      }
    });
  }
}
