import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {
  ValidationErrorResponseDto,
  ValidationErrorFieldResponseDto,
} from '@infrastructure/dtos/response/ValidationErrorResponseDto';

// TODO añadir mapper y sacar a constate literal
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    next();
    return;
  }

  const responseDto: ValidationErrorResponseDto = {
    message: 'Validación incorrecta',
    errors: error.array() as ValidationErrorFieldResponseDto[],
  };

  res.status(422).json(responseDto);
};
