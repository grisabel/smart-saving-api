import { Request, Response } from 'express';

import { AuthenticateUseCaseFactory } from '@Session/domain/useCases/AuthenticateUseCase';

import { LoginUserRequestDto } from '@Session/infrastructure/dtos/request/LoginUserRequestDto';
import { LoginResponseDto } from '@Session/infrastructure/dtos/response/LoginResponseDto';

import { RefreshTokenRequestDto } from '@Session/infrastructure/dtos/request/RefreshTokenRequestDto';
import { RefreshTokenResponseDto } from '@Session/infrastructure/dtos/response/RefreshTokenResponseDto';
import { ErrorResponseDto } from '@infrastructure/dtos/response/ErrorResponseDto';

const authenticateUseCase = AuthenticateUseCaseFactory.getIntance();

const loginUser = async (
  req: Request<LoginUserRequestDto>,
  res: Response<ErrorResponseDto | LoginResponseDto>
) => {
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

const refreshToken = async (
  req: Request<RefreshTokenRequestDto>,
  res: Response<ErrorResponseDto | RefreshTokenResponseDto>
) => {
  const body = req.body;

  const [error, responseDto] = await authenticateUseCase.verifyRefreshToken(
    body.refreshToken
  );

  if (error) {
    res.status(401).json(error); //todo
    return;
  }
  res.status(200).json(responseDto);
};

const deleteRefreshToken = async (
  req: Request<RefreshTokenRequestDto>,
  res: Response<ErrorResponseDto>
) => {
  const body = req.body;

  const [error] = await authenticateUseCase.deleteRefreshToken(
    body.refreshToken
  );

  if (error) {
    res.status(404).json(error); //todo
    return;
  }
  res.status(201).send();
};

export default {
  loginUser,
  refreshToken,
  deleteRefreshToken,
};
