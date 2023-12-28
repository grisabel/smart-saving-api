import JWTService from '@application/services/JWTService';
import { ErrorResponseMapper } from '@infrastructure/mappers/response/ErrorResponseMapper';
import { NextFunction, Request, Response } from 'express';

// TODO sacar a constate literal
export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers?.authorization.split('Bearer ')[1];

  if (accessToken) {
    try {
      const decodeToken = JWTService.verifyAcessToken(accessToken);
      req.user = { email: decodeToken.sub };
      next();
    } catch (error) {
      const responseDto = ErrorResponseMapper.toResponseDto({
        message: 'Access token is invalid. Please verify your credentials.',
      });
      res.status(401).send(responseDto);
    }
  } else {
    const responseDto = ErrorResponseMapper.toResponseDto({
      message:
        'Access token is missing. Please provide a valid token in headers to continue.',
    });
    return res.status(401).send(responseDto);
  }
};
