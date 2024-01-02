//TODO review texts
export const TOKEN_REPOSITORY_ERROR = {
  tokenNotExist: 'El token no existe',
};
export interface UserRepositoryErrorParams {
  tokenNotExist?: string;
}

export class TokenRepositoryError extends Error {
  static msg: string = 'TokenRepositoryError';
  public data: UserRepositoryErrorParams;

  constructor(data: UserRepositoryErrorParams) {
    super(TokenRepositoryError.msg);
    this.data = data;
  }
}

export interface RevokeAccessTokenInterfaceRepository {
  save(token: string): Promise<void>;
  find(token: string): Promise<string>;
  delete(token: string): Promise<void>;
}
