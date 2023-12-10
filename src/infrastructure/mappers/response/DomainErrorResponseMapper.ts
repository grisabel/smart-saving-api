import { DomainError } from '@domain/models/Error/DomainError';
import {
  ErrorResponseDto,
  DomainErrorDto,
} from '@infrastructure/dtos/response/ErrorResponseDto';

export class DomainErrorResponseMapper {
  static toResponse<T>(error: DomainError<T>, title: string): ErrorResponseDto {
    const errorMessages = !error?.data ? [] : Object.values(error.data);

    return {
      message: 'Validación de Dominio. ' + title,
      errors: errorMessages.map((errorMsg) => {
        return DomainErrorValidationMapper.toResponse(error.message, errorMsg);
      }),
    };
  }
}

export class DomainErrorValidationMapper {
  static toResponse<T>(errorType: string, errorMsg: string): DomainErrorDto {
    return {
      type: errorType,
      msg: errorMsg,
    };
  }
}
