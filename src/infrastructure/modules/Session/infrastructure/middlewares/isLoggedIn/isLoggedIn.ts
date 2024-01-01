import { NextFunction, Request, Response } from 'express';
import { ErrorResponseMapper } from '@infrastructure/mappers/response/ErrorResponseMapper';
import { AuthenticateUseCaseFactory } from '@Session/domain/useCases/AuthenticateUseCase';
import { Email } from '@domain/models/Email';
import { SessionReasonType } from '@infrastructure/modules/Session/application/SessionRepository/SessionInterfaceRepository';
import JWTService, { JWTServiceError } from '@application/services/JWTService';

const authenticateUseCase = AuthenticateUseCaseFactory.getIntance();

// TODO sacar a constate literal
export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationArray =
      req.headers?.authorization?.split('Bearer ') ?? [];
    const accessToken = authorizationArray[1];

    if (accessToken) {
      const [error, user] = await authenticateUseCase.verifyAccessToken(
        accessToken
      );
      if (!error) {
        req.user = user;
        next();
        return;
      }

      if (error instanceof JWTServiceError) {
        const ip =
          (req.headers?.['x-forwarded-for'] as string) ||
          req?.socket?.remoteAddress;

        await authenticateUseCase.logoutAccessToken(
          Email.createFromText(JWTService.decodeToken(accessToken).sub),
          ip ?? '',
          SessionReasonType.Session_Token_Expired
        );
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
  } catch (error) {
    next(error);
  }
};
