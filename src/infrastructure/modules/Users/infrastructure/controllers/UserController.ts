import { NextFunction, Request, Response } from 'express';

import { OnboardingUseCaseFactory } from '@Users/domain/useCases/OnboardingUseCase';

import { OnboardingUserRequestDto } from '@Users/infrastructure/dtos/request/OnboardingUserRequestDto';
import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';
import { Email } from '@domain/models/Email';
import { UserInfoResponseDto } from '../dtos/response/UserInfoResponseDto';
import { UserUseCaseFactory } from '../../domain/useCases/UserUseCase';
import { ResetPasswordRequestDto } from '../dtos/request/ResetPasswordRequestDto';
import { ResetPasswordConfirmRequestDto } from '../dtos/request/ResetPasswordConfirmRequestDto';
import { Id } from '@domain/models/Id/Id';
import { Password } from '@domain/models/Password';
import { ResetPasswordConfirmResponseDto } from '../dtos/response/ResetPasswordConfirmResponseDto';
import { DeleteAccountResponseDto } from '../dtos/response/DeleteAccountResponseDto';
import { DeleteAccountConfirmRequestDto } from '../dtos/request/DeleteAccountConfirmRequestDto';
import { DeleteAccountConfirmResponseDto } from '../dtos/response/DeleteAccountConfirmResponseDto';
import { User } from '@domain/models/User';

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

    const email = Email.createFromText(body.email);
    const password = Password.createFromText(body.password);
    const user = new User(
      email,
      body.firstName,
      body.lastName,
      body.dateBirth,
      body.objetive,
      password
    );
    const [error] = await onboardingUseCase.saveUser(user);
    if (error) {
      res.status(409).json(error);
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

    const [errorDto, responseDto] = await userUseCase.resetPassword(
      email,
      req.body.dateBirth
    );

    if (errorDto) {
      res.status(200).json(errorDto);
      return;
    }

    res.status(200).json(responseDto);
  } catch (error) {
    next(error);
  }
};

const resetPasswordConfirm = async (
  req: Request<ResetPasswordConfirmRequestDto>,
  res: Response<ResetPasswordConfirmResponseDto | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const operationId = Id.createFrom(req.params.operationId);
    const newPassword = Password.createFromText(req.body.password);

    const [errorDto, responseDto] = await userUseCase.resetPasswordConfirm(
      operationId,
      newPassword
    );

    if (errorDto) {
      res.status(errorDto.status).json(errorDto);
      return;
    }

    res.status(responseDto.status).json(responseDto);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (
  req: Request,
  res: Response<DeleteAccountResponseDto | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const [, responseDto] = await userUseCase.deleteAccount(
      Email.createFromText(req.user.email)
    );

    res.status(responseDto.status).json(responseDto);
  } catch (error) {
    next(error);
  }
};

const deleteAccountConfirm = async (
  req: Request<DeleteAccountConfirmRequestDto>,
  res: Response<DeleteAccountConfirmResponseDto | ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const email = Email.createFromText(req.user.email);
    const id = Id.createFrom(req.params.operationId);
    const password = Password.createHash(req.body.password);

    const [errorDto, responseDto] = await userUseCase.deleteAccountConfirm(
      id,
      email,
      password
    );

    if (errorDto) {
      res.status(errorDto.status).json(errorDto);
      return;
    }

    res.status(responseDto.status).json(responseDto);
  } catch (error) {
    next(error);
  }
};

export default {
  obtainUserInfo,
  createUser,
  resetPassword,
  resetPasswordConfirm,
  deleteUser,
  deleteAccountConfirm,
};
