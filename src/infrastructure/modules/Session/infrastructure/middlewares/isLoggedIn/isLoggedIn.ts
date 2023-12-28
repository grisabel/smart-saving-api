import { NextFunction, Request, Response } from 'express';
import { ErrorResponseMapper } from '@infrastructure/mappers/response/ErrorResponseMapper';
import { AuthenticateUseCaseFactory } from '@Session/domain/useCases/AuthenticateUseCase';

const authenticateUseCase = AuthenticateUseCaseFactory.getIntance();

// TODO sacar a constate literal
export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers?.authorization.split('Bearer ')[1];

  if (accessToken) {
    const [error, user] = await authenticateUseCase.verifyAccessToken(
      accessToken
    );
    if (!error) {
      req.user = user;
      next();
      return;
    }
    const responseDto = ErrorResponseMapper.toResponseDto({
      message: 'Access token is invalid. Please verify your credentials.',
    });
    res.status(401).send(responseDto);
  } else {
    const responseDto = ErrorResponseMapper.toResponseDto({
      message:
        'Access token is missing. Please provide a valid token in headers to continue.',
    });
    return res.status(401).send(responseDto);
  }
};
