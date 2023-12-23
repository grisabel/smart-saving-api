export interface LoginResponseDto {
  accessToken: string;
  tokenType: string; //bearer
  expiresIn: number; //3599
  scope: string;
}
