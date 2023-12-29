import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';
import { NextFunction, Request, Response } from 'express';

function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponseDto>,
  next: NextFunction
) {
  console.log('hoal');
  console.log(err);

  return res.status(500).json({ message: 'Server Internal Error' });
}

export default errorHandler;
