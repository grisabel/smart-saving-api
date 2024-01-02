export interface ValidationErrorResponseDto {
  message: string;
  errors: ValidationErrorFieldResponseDto[];
}

export interface ValidationErrorFieldResponseDto {
  type: string;
  msg: string;
  path: string;
  location: string;
}
