import { NextFunction, Request, Response } from 'express';

import { AuthenticateUseCaseFactory } from '@Session/domain/useCases/AuthenticateUseCase';

import { LoginUserRequestDto } from '@Session/infrastructure/dtos/request/LoginUserRequestDto';
import { LoginResponseDto } from '@Session/infrastructure/dtos/response/LoginResponseDto';

import { RefreshTokenRequestDto } from '@Session/infrastructure/dtos/request/RefreshTokenRequestDto';
import { RefreshTokenResponseDto } from '@Session/infrastructure/dtos/response/RefreshTokenResponseDto';
import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';
import { RevokeAccessTokenRequestDto } from '../dtos/request/RevokeAccessTokenRequestDto';
import { Email } from '@domain/models/Email';

const authenticateUseCase = AuthenticateUseCaseFactory.getIntance();

const loginUser = async (
  req: Request<LoginUserRequestDto>,
  res: Response<ErrorResponseDto | LoginResponseDto>,
  next: NextFunction
) => {
  try {
    const body = req.body;
    // TODO nginx
    const ip =
      (req.headers?.['x-forwarded-for'] as string) ||
      req?.socket?.remoteAddress;

    const [errorDto, responseDto] = await authenticateUseCase.authenticate(
      body.email,
      body.password,
      ip ?? ''
    );

    if (errorDto) {
      res.status(401).json(errorDto);
      return;
    }
    res.status(200).json(responseDto);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (
  req: Request<RefreshTokenRequestDto>,
  res: Response<ErrorResponseDto | RefreshTokenResponseDto>,
  next: NextFunction
) => {
  try {
    const body = req.body;
    // TODO nginx
    const ip =
      (req.headers?.['x-forwarded-for'] as string) ||
      req?.socket?.remoteAddress;

    const [errorDto, responseDto] =
      await authenticateUseCase.verifyRefreshToken(body.refreshToken, ip);

    if (errorDto) {
      res.status(401).json(errorDto); //todo
      return;
    }
    res.status(200).json(responseDto);
  } catch (error) {
    next(error);
  }
};

const logout = async (
  req: Request<RefreshTokenRequestDto>,
  res: Response<ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const revokeAccessToken = async (
  req: Request<RevokeAccessTokenRequestDto>,
  res: Response<ErrorResponseDto>,
  next: NextFunction
) => {
  try {
    const body = req.body;

    // TODO nginx
    const ip =
      (req.headers?.['x-forwarded-for'] as string) ||
      req?.socket?.remoteAddress;

    const [error] = await authenticateUseCase.revokeAccessToken(
      body.accessToken,
      Email.createFromText(req.user.email),
      ip ?? ''
    );

    if (error) {
      res.status(404).json(error); //todo
      return;
    }
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

export default {
  loginUser,
  refreshToken,
  logout,
  revokeAccessToken,
};
