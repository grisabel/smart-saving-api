import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

// prettier-ignore
const createUser = [
  body('firstName')
    .not().isEmpty(),
  body('lastName')
    .not().isEmpty(),
  body('dateBirth')
    .not().isEmpty(),
  body('objetive')
    .not().isEmpty(),
  body('email')
    .not().isEmpty(),
  body('repeatEmail')
    .not().isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.email) {
        throw new Error('El email y la repetición del email no coinciden');
      }
      return true;
    }),
  body('password')
    .not().isEmpty(),
  body('repeatPassword')
    .not().isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('El email y la repetición del email no coinciden');
      }
      return true;
    }),
];
// prettier-ignore

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    next();
    return;
  }

  res
    .status(422)
    .json({ message: 'Validación incorrecta', errors: error.array() });
};
export default {
  createUser,
};
