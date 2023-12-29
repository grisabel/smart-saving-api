export interface ResetPasswordConfirmRequestDto {
  password: string;
  repeatPassword: string;
  operationId: string;
}
