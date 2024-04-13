import { NextFunction, Request, Response } from 'express';

import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';
import { UserInfoResponseDto } from '../dtos/response/UserInfoResponseDto';
import { UserUseCaseFactory } from '../../domain/useCases/UserUseCase';

const userUseCase = UserUseCaseFactory.getIntance();

const obtainUserInfo = async (
  req: Request,
  res: Response<UserInfoResponseDto | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const [error, userInfo] = await userUseCase.obtainUserInfo(req.user.email);

    if (error) {
      res.status(404).json(error);
      return;
    }

    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
};

export default {
  obtainUserInfo,
};
