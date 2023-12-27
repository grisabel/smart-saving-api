import { Request, Response } from 'express';
import { PostUserDTO } from '@infrastructure/modules/users/dtos/request/PostUserDTO';
import { OnboardingUseCaseFactory } from '@domain/useCases/OnboardingUseCase';

// TODO maybe move to users
const onboardingUseCase = OnboardingUseCaseFactory.getIntance();

const obtainUser = async (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
};

const createUser = async (req: Request<PostUserDTO>, res: Response) => {
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
