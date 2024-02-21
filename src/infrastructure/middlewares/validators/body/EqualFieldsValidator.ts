import { CustomValidator } from 'express-validator';

export const equalFields = (
  propertyName: string,
  errorMessage?: string
): CustomValidator => {
  return (value, { req }) => {
    if (value !== req.body[propertyName]) {
      //todo
      throw new Error(errorMessage);
    }
    return true;
  };
};
