import { Email } from '@domain/models/Email';
import { Id } from '@domain/models/Id/Id';
import { CustomValidator, ValidationChain } from 'express-validator';

export const id = (): CustomValidator => {
  return (value) => {
    try {
      Id.createFrom(value);
      return true;
    } catch (error) {
      throw new Error(error.data.format);
    }
  };
};
