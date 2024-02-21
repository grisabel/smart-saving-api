import { DateTimeModel } from '@application/services/DateTimeService/DateTimeInterfaceService';
import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import { CustomValidator, ValidationChain } from 'express-validator';

export const date = (
  fieldName: string,
  format: string = DATE_FORMATS.Date
): CustomValidator => {
  return (value) => {
    const resul = DateTimeService.isValid({
      date: value,
      format,
    });

    if (!resul) {
      throw new Error(
        `El campo ${fieldName} debe seguir el siguiente formato ${DATE_FORMATS.Date}`
      ); // todo
    }
    return true;
  };
};

export const isDateEarlier = (
  propertyName: string,
  format: string = DATE_FORMATS.Date
): CustomValidator => {
  return (value, { req }) => {
    const a: DateTimeModel = {
      date: value,
      format,
    };

    const b: DateTimeModel = {
      date: req.query[propertyName], //todo
      format,
    };

    if (!DateTimeService.validate(a, b, DateTimeService.VALIDATE_SET.UNTIL)) {
      throw new Error(`La fecha ${a.date} debe ser anterior a ${b.date}`);
    }
    return true;
  };
};
