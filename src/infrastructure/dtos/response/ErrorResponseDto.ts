export interface ErrorResponseDto {
  message: string;
  errors: ErrorFieldResponseDto[];
}

export interface ErrorFieldResponseDto {
  type: string;
  msg: string;
}
