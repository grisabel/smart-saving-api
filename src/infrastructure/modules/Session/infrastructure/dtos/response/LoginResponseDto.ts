export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  token_type: 'bearer';
  expires: number;
}
