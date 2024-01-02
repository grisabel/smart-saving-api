import { Email } from '@domain/models/Email';
import { CustomValidator, ValidationChain } from 'express-validator';

export const email = (): CustomValidator => {
  return (value) => {
    try {
      Email.createFromText(value);
      return true;
    } catch (error) {
      throw new Error(error.data.format);
    }
  };
};
