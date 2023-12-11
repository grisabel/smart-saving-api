import { Body } from '../../../../infrastructure/validators/body';

// prettier-ignore
const createUser = [
  Body('firstName')
    .required(),
  Body('lastName')
    .required(),
  Body('dateBirth')
    .required(),
  Body('objetive')
    .required(),
  Body('email')
    .required(),
  Body('repeatEmail')
    .required()
    .equalFields('email', 'El email y la repetición del email no coinciden'),
  Body('password')
    .required(),
  Body('repeatPassword')
    .required()
    .equalFields('password', 'La contraseña y la repetición de la contraseña no coinciden'),
];
// prettier-ignore

export default {
  createUser,
};
