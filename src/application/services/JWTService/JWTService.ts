import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../../../../src/infrastructure/config';

const createJWT = <T extends object>(emailDTO: string, payload: T): string => {
  let signOption: SignOptions = {
    expiresIn: config.JWT.expires_time,
    algorithm: 'HS256',
    subject: emailDTO,
  };
  return jwt.sign(payload, config.JWT.secret, signOption);
};

export default {
  createJWT,
};
