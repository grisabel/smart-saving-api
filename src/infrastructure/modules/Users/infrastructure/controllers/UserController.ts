import { Request, Response } from 'express';

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

const onboardingUseCase = OnboardingUseCaseFactory.getIntance();
const userUseCase = UserUseCaseFactory.getIntance();

const obtainUserInfo = async (
  req: Request,
  res: Response<UserInfoResponseDto | ErrorResponseDto>
) => {
  const [error, userInfo] = await userUseCase.obtainUserInfo(req.user.email);

  if (error) {
    res.status(404).json(error);
    return;
  }

  res.status(200).json(userInfo);
};

const createUser = async (
  req: Request<OnboardingUserRequestDto>,
  res: Response<ErrorResponseDto>
) => {
  const body = req.body;

  const [error] = await onboardingUseCase.saveUser(body);

  if (error) {
    res.status(422).json(error);
    return;
  }
  res.status(204).json();
};

const deleteUser = async (req: Request, res: Response) => {
  res.status(200).json({ ok: 'ok' });
};

export default {
  obtainUserInfo,
  createUser,
  deleteUser,
};
