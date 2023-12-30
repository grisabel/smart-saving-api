import { Id } from '@domain/models/Id/Id';
import { Operation, OperationType } from '../models/OperationId';
import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';

export class OperationExample {
  static operationResetPassword(): Operation {
    return {
      email: 'isabelchele26@gmail.com',
      id: Id.createId().getValue(),
      type: OperationType.RESET_PASSWORD,
      expiresIn: DateTimeService.now() + 60 * 60 * 1000,
    };
  }
  static operationResetPasswordExpired(): Operation {
    return {
      email: 'isabelchele26@gmail.com',
      id: Id.createId().getValue(),
      type: OperationType.RESET_PASSWORD,
      expiresIn: parseInt(
        DateTimeService.parse(
          { date: '29/12/2023', format: DATE_FORMATS.Date },
          DATE_FORMATS.TimestampMs
        ),
        10
      ),
    };
  }
  static operationResetPasswordWithoutUser(): Operation {
    return {
      email: 'operationResetPasswordWithoutUser@gmail.com',
      id: Id.createId().getValue(),
      type: OperationType.RESET_PASSWORD,
      expiresIn: DateTimeService.now() + 60 * 60 * 1000,
    };
  }

  static operationDeleteAccount(): Operation {
    return {
      email: 'isabelchele26@gmail.com',
      id: Id.createId().getValue(),
      type: OperationType.DELETE_ACCOUNT,
      expiresIn: DateTimeService.now() + 15 * 24 * 60 * 60 * 1000,
    };
  }
  static operationDeleteAccountExpired(): Operation {
    return {
      email: 'isabelchele26@gmail.com',
      id: Id.createId().getValue(),
      type: OperationType.DELETE_ACCOUNT,
      expiresIn: parseInt(
        DateTimeService.parse(
          { date: '29/12/2023', format: DATE_FORMATS.Date },
          DATE_FORMATS.TimestampMs
        ),
        10
      ),
    };
  }
}
