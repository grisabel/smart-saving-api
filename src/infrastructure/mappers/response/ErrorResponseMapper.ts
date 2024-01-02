import { DomainError } from '@domain/models/Error/DomainError';
import {
  ErrorResponseDto,
  ErrorFieldResponseDto,
} from '@infrastructure/dtos/response/ErrorResponseDto';

interface ErrorResponseMapperParams<T> {
  message: string;
  error?: DomainError<T>;
  status?: number; //todo
}

export class ErrorResponseMapper {
  static toResponseDto<T>({
    message,
    error,
    status,
  }: ErrorResponseMapperParams<T>): ErrorResponseDto {
    if (!error) {
      return {
        ...(status ? { status } : {}),
        message,
      };
    }

    const errorMessages = !error?.data ? [] : Object.values(error.data);

    return {
      ...(status ? { status } : {}),
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
