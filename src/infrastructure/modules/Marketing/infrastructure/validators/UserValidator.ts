import { DateTimeModel } from '@application/services/DateTimeService/DateTimeInterfaceService';
import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import { Body, Param } from '@infrastructure/middlewares/validators/body';

// prettier-ignore
const createUser = [
  Body('firstName')
    .required(),
  Body('lastName')
    .required(),
  Body('dateBirth')
    .date()
    .required(),
  Body('objetive')
    .required(),
  Body('email')
    .email()
    .required(),
  Body('repeatEmail')
    .required()
    .equalFields('email', 'El email y la repetición del email no coinciden'),
  Body('password')
    .password()
    .required(),
  Body('repeatPassword')
    .required()
    .equalFields('password', 'La contraseña y la repetición de la contraseña no coinciden'),
];

export default {
  createUser,
};
