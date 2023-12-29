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

const resetPassword = [
  Body('dateBirth')
  .required()
  .custom((value) => {
    const resul = DateTimeService.isValid({
      date: value,
      format: DATE_FORMATS.Date
    })

    if (!resul) {
      throw new Error(`El formato valido debe ser ${ DATE_FORMATS.Date}`);
    }
    return true; 
  }),
 Body('email')
  .required(),
]

export default {
  createUser,
  resetPassword,
};
