import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import { CustomValidator, ValidationChain } from 'express-validator';

export const date = (fieldName: string): CustomValidator => {
  return (value) => {
    const resul = DateTimeService.isValid({
      date: value,
      format: DATE_FORMATS.Date,
    });

    if (!resul) {
      throw new Error(
        `El campo ${fieldName} debe seguir el siguiente formato ${DATE_FORMATS.Date}`
      ); // todo
    }
    return true;
  };
};
