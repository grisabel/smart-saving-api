import { DomainError } from '@domain/models/Error/DomainError';
import {
  ErrorResponseDto,
  ErrorFieldResponseDto,
} from '@infrastructure/dtos/response/ErrorResponseDto';

export class ErrorResponseMapper {
  static toResponse<T>(
    error: DomainError<T>,
    message: string
  ): ErrorResponseDto {
    const errorMessages = !error?.data ? [] : Object.values(error.data);

    return {
      message,
      errors: errorMessages.map((errorMsg) => {
        return ErrorFieldValidationMapper.toResponse(error.message, errorMsg);
      }),
    };
  }
}

export class ErrorFieldValidationMapper {
  static toResponse<T>(
    errorType: string,
    errorMsg: string
  ): ErrorFieldResponseDto {
    return {
      type: errorType,
      msg: errorMsg,
    };
  }
}
