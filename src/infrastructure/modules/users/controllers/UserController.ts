import { Request, Response } from 'express';
import { PostUserDTO } from '../dtos/request/PostUserDTO';
import { OnboardingUseCase } from '../../../../domain/useCases/OnboardingUseCase';

const onboardingUseCase = new OnboardingUseCase();

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
