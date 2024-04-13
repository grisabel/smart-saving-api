import { DDBBConnectionError, prisma } from '@application/repository/db';
import {
  TOKEN_REPOSITORY_ERROR,
  RevokeAccessTokenInterfaceRepository,
  TokenRepositoryError,
} from './TokenInterfaceRepositoty';

export class TokenSqlRepository
  implements RevokeAccessTokenInterfaceRepository
{
  async save(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.revokeAccessToken
        .create({
          data: { token: token },
        })
        .then(() => resolve())
        .catch((error) => {
          if (error.name == 'PrismaClientInitializationError') {
            reject(new DDBBConnectionError());
            return;
          }
          reject(error);
        });
    });
  }

  async find(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      prisma.revokeAccessToken
        .findFirst({ where: { token: token } })
        .then((resul) => resolve(resul.token))
        .catch((error) => {
          if (error.name == 'PrismaClientInitializationError') {
            reject(new DDBBConnectionError());
            return;
          }

          reject(
            new TokenRepositoryError({
              tokenNotExist: TOKEN_REPOSITORY_ERROR.tokenNotExist,
            })
          );
        });
    });
  }

  async delete(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.revokeAccessToken
        .deleteMany({
          where: {
            token: token,
          },
        })
        .then((resul) => {
          if (resul.count === 0) {
            const error = new TokenRepositoryError({
              tokenNotExist: TOKEN_REPOSITORY_ERROR.tokenNotExist,
            });
            reject(error);
            return;
          }
          resolve();
        })
        .catch((error) => {
          if (error.name == 'PrismaClientInitializationError') {
            reject(new DDBBConnectionError());
            return;
          }

          reject(
            new TokenRepositoryError({
              tokenNotExist: TOKEN_REPOSITORY_ERROR.tokenNotExist,
            })
          );
        });
    });
  }
}
