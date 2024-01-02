export interface RefreshTokenResponseDto {
  accessToken: string;
  token_type: 'bearer';
  expires: number;
}
