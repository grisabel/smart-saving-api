import { Request, Response } from 'express';

import { OnboardingUseCaseFactory } from '@Users/domain/useCases/OnboardingUseCase';

import { OnboardingUserRequestDto } from '@Users/infrastructure/dtos/request/OnboardingUserRequestDto';

const onboardingUseCase = OnboardingUseCaseFactory.getIntance();

const obtainUser = async (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
};

const createUser = async (
  req: Request<OnboardingUserRequestDto>,
  res: Response
) => {
  const body = req.body;

  const [error] = await onboardingUseCase.saveUser(body);

  if (error) {
    res.status(422).json(error);
    return;
  }
  res.status(204).json();
};

export default {
  obtainUser,
  createUser,
};
