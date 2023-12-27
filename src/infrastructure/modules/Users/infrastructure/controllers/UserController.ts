import { Request, Response } from 'express';

import { OnboardingUseCaseFactory } from '@Users/domain/useCases/OnboardingUseCase';

import { OnboardingUserRequestDto } from '@Users/infrastructure/dtos/request/OnboardingUserRequestDto';
import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';

const onboardingUseCase = OnboardingUseCaseFactory.getIntance();

const obtainUser = async (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
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
  obtainUser,
  createUser,
  deleteUser,
};
