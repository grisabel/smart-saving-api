import { NextFunction, Request, Response } from 'express';

import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';

const obtainAccountSummary = async (
    req: Request<any>,
    res: Response<any | ErrorResponseDto>,
    next: NextFunction
  ) => {
    try {
      res.status(200).json({ok: 'ok'});
    } catch (error) {
      next(error);
    }
  };

export default {
    obtainAccountSummary
}