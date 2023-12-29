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

const onboardingUseCase = OnboardingUseCaseFactory.getIntance();
const userRepository = UserFactoryRepository.getInstance();

const obtainUserInfo = async (
  req: Request,
  res: Response<UserInfoResponseDto | ErrorResponseDto>
) => {
  try {
    const email = Email.createFromText(req.user.email);
    const userInfo = await userRepository.findByEmail(email);

    const responseDto = UserInfoResponseMapper.toResponseDto(userInfo);
    res.status(200).json(responseDto);
  } catch (error) {
    if (error instanceof UserRepositoryError) {
      const errorDto = ErrorResponseMapper.toResponseDto({
        message: 'Usuario no encontrado', // todo y create userUseCase
      });
      res.status(404).json(errorDto);
    }
    throw error;
  }
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
