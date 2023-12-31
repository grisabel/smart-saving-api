import { RevokeAccessTokenInterfaceRepository } from './TokenInterfaceRepositoty';
import { TokenLocalRepository } from './TokenLocalRepository';

export class TokenFactoryRepository {
  static instance: RevokeAccessTokenInterfaceRepository | null = null;

  static getInstance(): RevokeAccessTokenInterfaceRepository {
    if (!TokenFactoryRepository.instance) {
      TokenFactoryRepository.instance = new TokenLocalRepository();
    }
    return TokenFactoryRepository.instance;
  }
}
