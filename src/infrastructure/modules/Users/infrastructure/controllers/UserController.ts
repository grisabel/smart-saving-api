import { NextFunction, Request, Response } from 'express';

import { OnboardingUseCaseFactory } from '@Users/domain/useCases/OnboardingUseCase';

import { OnboardingUserRequestDto } from '@Users/infrastructure/dtos/request/OnboardingUserRequestDto';
import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';
import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';
import { Email } from '@domain/models/Email';
import { UserInfoResponseMapper } from '../mappers/response/UserInfoResponseMapper';
import { UserRepositoryError } from '@application/repository/UserRepository/UserInterfaceRepository';
import { ErrorResponseMapper } from '@infrastructure/mappers/response/ErrorResponseMapper';
import { UserInfoResponseDto } from '../dtos/response/UserInfoResponseDto';
import { UserUseCaseFactory } from '../../domain/useCases/UserUseCase';
import { ResetPasswordRequestDto } from '../dtos/request/ResetPasswordRequestDto';
import { EmailError } from '@domain/models/Email/EmailError';

const onboardingUseCase = OnboardingUseCaseFactory.getIntance();
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

const createUser = async (
  req: Request<OnboardingUserRequestDto>,
  res: Response<ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const body = req.body;

    const [error] = await onboardingUseCase.saveUser(body);

    if (error) {
      res.status(422).json(error);
      return;
    }
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req: Request<ResetPasswordRequestDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = Email.createFromText(req.body.email);
    res.status(200).json({ ok: 'ok' });
  } catch (error) {
    if (error instanceof EmailError) {
      const errorDto = ErrorResponseMapper.toResponseDto({
        message: 'Email Inválido', // todo
        error,
      });
      res.status(422).json(errorDto);
      return;
    }
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ ok: 'ok' });
};

export default {
  obtainUserInfo,
  createUser,
  resetPassword,
  deleteUser,
};
