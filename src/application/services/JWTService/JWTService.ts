import jwt, { SignOptions } from 'jsonwebtoken';
import config from '@infrastructure/config';

const createJWT = <T extends object>(
  emailDTO: string,
  payload: T
): { token: string; expiresIn: number } => {
  let signOption: SignOptions = {
    expiresIn: config.JWT.expires_time,
    algorithm: 'HS256',
    subject: emailDTO,
  };
  const token = jwt.sign(payload, config.JWT.secret, signOption);
  const decodedToken = jwt.decode(token, { json: true });

  return {
    token,
    expiresIn: decodedToken.exp,
  };
};

export default {
  createJWT,
};
