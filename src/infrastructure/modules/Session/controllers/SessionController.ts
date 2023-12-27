import { Request, Response } from 'express';

import { AuthenticateUseCaseFactory } from '@domain/useCases/AuthenticateUseCase';

import { LoginUserRequestDto } from '../dtos/request/LoginUserRequestDto';
import { LoginResponseDto } from '../dtos/response/LoginResponseDto';
import { LoginErrorResponseDto } from '../dtos/response/LoginErrorResponseDto';

import { RefreshTokenRequestDto } from '../dtos/request/RefreshTokenRequestDto';
import { RefreshTokenErrorResponseDto } from '../dtos/response/RefreshTokenErrorResponseDto';
import { RefreshTokenResponseDto } from '../dtos/response/RefreshTokenResponseDto';

// TODO maybe move to session
const authenticateUseCase = AuthenticateUseCaseFactory.getIntance();

const loginUser = async (
  req: Request<LoginUserRequestDto>,
  res: Response<LoginErrorResponseDto | LoginResponseDto>
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
  res: Response<RefreshTokenErrorResponseDto | RefreshTokenResponseDto>
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
  res: Response<RefreshTokenErrorResponseDto>
) => {
  const params = req.params;

  const [error] = await authenticateUseCase.deleteRefreshToken(
    params.refreshToken
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
