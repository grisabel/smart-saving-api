import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

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
