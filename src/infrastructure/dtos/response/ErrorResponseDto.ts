export interface ErrorResponseDto {
  message: string;
  errors: DomainErrorDto[];
}

export interface DomainErrorDto {
  type: string;
  msg: string;
}

export interface ValidationErrorDto {
  type: string;
  msg: string;
  path: string;
  location: string;
}
