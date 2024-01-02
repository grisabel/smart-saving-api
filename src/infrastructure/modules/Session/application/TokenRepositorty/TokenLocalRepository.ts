import {
  TOKEN_REPOSITORY_ERROR,
  RevokeAccessTokenInterfaceRepository,
  TokenRepositoryError,
} from './TokenInterfaceRepositoty';

export class TokenLocalRepository
  implements RevokeAccessTokenInterfaceRepository
{
  private localTokens: string[] = [];

  async save(token: string): Promise<void> {
    return new Promise((resolve) => {
      this.localTokens.push(token);
      resolve();
    });
  }

  async find(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filterArray = this.localTokens.filter((refreshToken) => {
        return refreshToken == token;
      });

      if (filterArray.length === 0) {
        const error = new TokenRepositoryError({
          tokenNotExist: TOKEN_REPOSITORY_ERROR.tokenNotExist,
        });
        reject(error);
      } else {
        resolve(filterArray[0]);
      }
    });
  }

  async delete(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const filterArray = this.localTokens.filter((refreshToken) => {
        return refreshToken !== token;
      });

      if (filterArray.length === this.localTokens.length) {
        const error = new TokenRepositoryError({
          tokenNotExist: TOKEN_REPOSITORY_ERROR.tokenNotExist,
        });
        reject(error);
      } else {
        this.localTokens = filterArray;
        resolve();
      }
    });
  }
}
