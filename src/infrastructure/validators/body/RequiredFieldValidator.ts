import { ValidationChain } from 'express-validator';

export const required = (
  chain: ValidationChain,
  fieldName: string
): ValidationChain => {
  return chain.notEmpty().withMessage(`${fieldName} es requerido`);
};
