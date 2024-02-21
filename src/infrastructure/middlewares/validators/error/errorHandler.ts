import { DDBBConnectionError } from '@application/repository/db';
import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';
import { NextFunction, Request, Response } from 'express';

function errorHandler(
  error: Error,
  req: Request,
  res: Response<ErrorResponseDto>,
  next: NextFunction
) {
  console.log(error);
  if (error instanceof DDBBConnectionError) {
    return res.status(500).json({ message: 'Server Internal Error' });
  }

  return res.status(500).json({ message: 'Server Internal Error' });
}

export default errorHandler;
