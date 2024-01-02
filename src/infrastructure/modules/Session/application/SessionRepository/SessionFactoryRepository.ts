import { SessionInterfaceRepository } from './SessionInterfaceRepository';
import { SessionSqlRepository } from './SessionSqlRepository';

export class SessionFactoryRepository {
  static instance: SessionInterfaceRepository | null = null;

  static getInstance(): SessionInterfaceRepository {
    if (!SessionFactoryRepository.instance) {
      SessionFactoryRepository.instance = new SessionSqlRepository();
    }
    return SessionFactoryRepository.instance;
  }
}
