import { CustomValidator } from 'express-validator';

export const equalFields = (
  propertyName: string,
  errorMessage?: string
): CustomValidator => {
  return (value, { req }) => {
    if (value !== req.body[propertyName]) {
      throw new Error(errorMessage);
    }
    return true;
  };
};
