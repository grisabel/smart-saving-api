import jwt, { SignOptions } from 'jsonwebtoken';
import config from '@infrastructure/config';

//TODO review texts
export const JWR_SERVICE_ERROR = {
  verifyRefreshTokenError: 'Error al verificar el refreshToken',
  verifyAcessTokenError: 'Error al verificar el accessToken',
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
): { accessToken: string; expiredIn: number } => {
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
  const decodedToken = jwt.decode(token, { json: true });

  return {
    accessToken: token,
    expiredIn: decodedToken.exp,
  };
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
      verifyTokenError: JWR_SERVICE_ERROR.verifyRefreshTokenError,
    });
  }
};

export interface VerifyAcessTokenResponse {
  sub: string;
}
const verifyAcessToken = (refreshToken: string): VerifyAcessTokenResponse => {
  try {
    jwt.verify(refreshToken, config.JWT.ACCESS_TOKEN.PRIVATE_KEY);
    const decodedToken = jwt.decode(refreshToken, { json: true });

    return {
      sub: decodedToken.sub,
    };
  } catch (error) {
    throw new JWTServiceError({
      verifyTokenError: JWR_SERVICE_ERROR.verifyAcessTokenError,
    });
  }
};

export default {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  verifyAcessToken,
};
