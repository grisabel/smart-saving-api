import jwt, { SignOptions } from 'jsonwebtoken';
import config from '@infrastructure/config';

//TODO review texts
export const JWR_SERVICE_ERROR = {
  verifyTokenError: 'Error al verificar el token',
};
export interface JWTServiceErrorParams {
  verifyTokenError?: string;
}

export class JWTServiceError extends Error {
  static msg: string = 'JWTServiceError';
  public data: JWTServiceErrorParams;

  constructor(data: JWTServiceErrorParams) {
    super(JWTServiceError.msg);
    this.data = data;
  }
}

export interface AccessTokenPayload {
  scope: string;
}

const createAccessToken = (
  emailDTO: string,
  payload: AccessTokenPayload
): string => {
  let signOption: SignOptions = {
    expiresIn: config.JWT.ACCESS_TOKEN.EXPIRES_TIME,
    algorithm: 'HS256',
    subject: emailDTO,
  };
  const token = jwt.sign(
    payload,
    config.JWT.ACCESS_TOKEN.PRIVATE_KEY,
    signOption
  );

  return token;
};

const createRefreshToken = (emailDTO: string): string => {
  let signOption: SignOptions = {
    expiresIn: config.JWT.REFRESH_TOKEN.EXPIRES_TIME,
    algorithm: 'HS256',
    subject: emailDTO,
  };
  const token = jwt.sign({}, config.JWT.REFRESH_TOKEN.PRIVATE_KEY, signOption);

  return token;
};

export interface VerifyRefreshTokenResponse {
  sub: string;
  exp: number;
}

const verifyRefreshToken = (
  refreshToken: string
): VerifyRefreshTokenResponse => {
  try {
    jwt.verify(refreshToken, config.JWT.REFRESH_TOKEN.PRIVATE_KEY);
    const decodedToken = jwt.decode(refreshToken, { json: true });

    return {
      exp: decodedToken.exp,
      sub: decodedToken.sub,
    };
  } catch (error) {
    throw new JWTServiceError({
      verifyTokenError: JWR_SERVICE_ERROR.verifyTokenError,
    });
  }
};

export default {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
};
