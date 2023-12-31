import config from '@infrastructure/config';
import { RevokeAccessTokenInterfaceRepository } from './TokenInterfaceRepositoty';
import { TokenLocalRepository } from './TokenLocalRepository';
import { TokenSqlRepository } from './TokenSqlRepository';

export class TokenFactoryRepository {
  static instance: RevokeAccessTokenInterfaceRepository | null = null;

  static getInstance(): RevokeAccessTokenInterfaceRepository {
    if (!TokenFactoryRepository.instance) {
      if (config.ENV === 'TEST') {
        TokenFactoryRepository.instance = new TokenLocalRepository();
      } else {
        TokenFactoryRepository.instance = new TokenSqlRepository();
      }
    }
    return TokenFactoryRepository.instance;
  }
}
