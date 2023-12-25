import { TokenInterfaceRepository } from './TokenInterfaceRepositoty';
import { TokenLocalRepository } from './TokenLocalRepository';

export class TokenFactoryRepository {
  static instance: TokenInterfaceRepository | null = null;

  static getInstance(): TokenInterfaceRepository {
    if (!TokenFactoryRepository.instance) {
      TokenFactoryRepository.instance = new TokenLocalRepository();
    }
    return TokenFactoryRepository.instance;
  }
}
