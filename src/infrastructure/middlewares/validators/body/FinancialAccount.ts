import { Email } from '@domain/models/Email';
import { CustomValidator, ValidationChain } from 'express-validator';

export const financialAccount = (): CustomValidator => {
  return (value) => {
    const num = Number(value);

    if (!Number.isInteger(num) || !/^\d+$/.test(value)) {
        throw new Error("La cuenta proporcionado no es un número entero.");
    }

    return true;
  };
};
