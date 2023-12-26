import jwt, { SignOptions } from 'jsonwebtoken';
import config from '@infrastructure/config';

const token1 =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6InNtYXJ0LXNhdmluZy1hcGkiLCJpYXQiOjE3MDM1MjE3OTcsImV4cCI6MTcwMzUyNTM5Nywic3ViIjoidGVzdEB0ZXN0LmNvbSJ9.2gscDxHm8yyxy5VRZ821cnaJHjtlLRNc9q8kok4JvhI';

const token2 =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6InNtYXJ0LXNhdmluZy1hcGkiLCJpYXQiOjE3MDM1MjIyODUsImV4cCI6MTcwMzUyNTg4NSwic3ViIjoidGVzdEB0ZXN0LmNvbSJ9.ewE-Mo5o-qKIHujPaBR2MH11X7a1aC1CJnKmUyBYx5U';

const refreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM1Nzk3NzcsImV4cCI6MTcwMzY2NjE3Nywic3ViIjoidGVzdEB0ZXN0LmNvbSJ9.N08kOrubwdk9-nNGX6AaCDzw00CKXJhqlH_-_lvUNYM';

export class TokenExample {
  static token1(): string {
    return token1;
  }
  static token2(): string {
    return token2;
  }
  static refreshToken(): string {
    return refreshToken;
  }
  static invalidToken(): string {
    let signOption: SignOptions = {
      expiresIn: '1',
      algorithm: 'HS256',
      subject: 'uesr1@test.com',
    };
    const token = jwt.sign(
      {},
      config.JWT.REFRESH_TOKEN.PRIVATE_KEY,
      signOption
    );

    return token;
  }
}
