import { CustomValidator } from 'express-validator';

/**
 * Only use in body() express-validator
 * @param {any} param1
 * @param {any} param2
 */
export const equalFields = (
  propertyName: string,
  errorMessage: string
): CustomValidator => {
  return (value, { req }) => {
    if (value !== req.body[propertyName]) {
      throw new Error(errorMessage);
    }
    return true;
  };
};
