import { DomainError } from '@domain/models/Error/DomainError';
import {
  ErrorResponseDto,
  ErrorFieldResponseDto,
} from '@infrastructure/dtos/response/ErrorResponseDto';

interface ErrorResponseMapperParams<T> {
  message: string;
  error?: DomainError<T>;
}

export class ErrorResponseMapper {
  static toResponseDto<T>({
    message,
    error,
  }: ErrorResponseMapperParams<T>): ErrorResponseDto {
    if (!error) {
      return { message };
    }

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
