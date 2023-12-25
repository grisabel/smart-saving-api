import jwt, { SignOptions } from 'jsonwebtoken';
import config from '@infrastructure/config';

const createAccessToken = <T extends object>(
  emailDTO: string,
  payload: T
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

const createRefreshToken = <T extends object>(emailDTO: string): string => {
  let signOption: SignOptions = {
    expiresIn: config.JWT.REFRESH_TOKEN.EXPIRES_TIME,
    algorithm: 'HS256',
    subject: emailDTO,
  };
  const token = jwt.sign({}, config.JWT.REFRESH_TOKEN.EXPIRES_TIME, signOption);

  return token;
};

export default {
  createAccessToken,
  createRefreshToken,
};
