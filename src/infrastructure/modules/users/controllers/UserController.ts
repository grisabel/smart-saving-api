import { Request, Response } from 'express';
import { PostUserDTO } from '@infrastructure/modules/users/dtos/request/PostUserDTO';
import { PostUserLoginDTO } from '@infrastructure/modules/users/dtos/request/PostUserLoginDTO';
// TODO maybe move to users
import { OnboardingUseCase } from '@domain/useCases/OnboardingUseCase';
import { AuthenticateUseCase } from '@domain/useCases/AuthenticateUseCase';
import { UserLocalRepository } from '@application/repository/UserRepository/UserLocalRepository';
import { LoginResponseDto } from '../dtos/response/LoginResponseDto';

const onboardingUseCase = new OnboardingUseCase();

let userRepository = new UserLocalRepository();
const authenticateUseCase = new AuthenticateUseCase(userRepository);

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

  const [error] = await authenticateUseCase.authenticate(
    body.email,
    body.password
  );

  if (error) {
    res.status(401).json(error);
    return;
  }
  res.status(204).json();
};

export default {
  obtainUser,
  createUser,
  loginUser,
};
