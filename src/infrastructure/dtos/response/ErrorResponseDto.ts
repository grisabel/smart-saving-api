export interface ErrorResponseDto {
  message: string;
  status?: number; //todo
  errors?: ErrorFieldResponseDto[];
}

export interface ErrorFieldResponseDto {
  type: string;
  msg: string;
}
