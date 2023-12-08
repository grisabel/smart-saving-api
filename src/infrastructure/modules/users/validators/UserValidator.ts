import { error } from 'console';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const createUser = [
  body('firstName').not().isEmpty(),
  body('lastName').not().isEmpty(),
  body('dateBirth').not().isEmpty(),
  body('objetive').not().isEmpty(),
  body('email').not().isEmpty(),
  body('repeatEmail').not().isEmpty().equals('email'),
  body('password').not().isEmpty(),
  body('repeatPassword').not().isEmpty(),
];

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
