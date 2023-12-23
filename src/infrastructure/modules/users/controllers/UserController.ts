import { Request, Response } from 'express';
import { PostUserDTO } from '@infrastructure/modules/users/dtos/request/PostUserDTO';
import { PostUserLoginDTO } from '@infrastructure/modules/users/dtos/request/PostUserLoginDTO';
// TODO maybe move to users
import { onboardingUseCase } from '@domain/useCases/OnboardingUseCase';
import { authenticateUseCase } from '@domain/useCases/AuthenticateUseCase';

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

const loginUser = async (req: Request<PostUserLoginDTO>, res: Response) => {
  const body = req.body;

  const [error, responseDto] = await authenticateUseCase.authenticate(
    body.email,
    body.password
  );

  if (error) {
    res.status(401).json(error);
    return;
  }
  res.status(200).json(responseDto);
};

export default {
  obtainUser,
  createUser,
  loginUser,
};
