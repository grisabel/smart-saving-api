import { Id } from '@domain/models/Id/Id';
import { Operation, OperationType } from '../models/OperationId';

export class OperationExample {
  static operationResetPassword(): Operation {
    return {
      email: 'isabelchele26@gmail.com',
      id: Id.createId().getValue(),
      type: OperationType.RESET_PASSWORD,
      expiresIn: new Date().getMilliseconds() + 60 * 60 * 1000,
    };
  }
}
