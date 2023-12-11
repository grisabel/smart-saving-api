import jwt, { SignOptions } from 'jsonwebtoken';

const createJWT = <T extends object>(emailDTO: string, payload: T): string => {
  let signOption: SignOptions = {
    expiresIn: 1000,
    algorithm: 'HS256',
    subject: emailDTO,
  };
  return jwt.sign(payload, 'miContraseña', signOption);
};

export default {
  createJWT,
};
