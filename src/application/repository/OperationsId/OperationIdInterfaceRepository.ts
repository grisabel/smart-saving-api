import { Id } from '@domain/models/Id/Id';
import { Email } from '../../../domain/models/Email';
import { User } from '../../../domain/models/User';
import { Operation, OperationType } from './models/OperationId';

//TODO review texts
export const OPERATIONSID_REPOSITORY_ERROR = {
  idNotExist: 'El id no existe',
};
export interface OperationsIdRepositoryErrorParams {
  idNotExist?: string;
}

export class OperationsIdRepositoryError extends Error {
  static msg: string = 'OperationsIdRepositoryError';
  public data: OperationsIdRepositoryErrorParams;

  constructor(data: OperationsIdRepositoryErrorParams) {
    super(OperationsIdRepositoryError.msg);
    this.data = data;
  }
}

export interface OperationsIdInterfaceRepository {
  save(id: Id, email: Email, type: OperationType): Promise<void>;
  find(id: Id): Promise<Operation>;
  delete(id: Id): Promise<void>;
}
