import { UserExample } from '@domain/models/User/test/User.example';
import { UserInterfaceRepository } from './UserInterfaceRepository';
import { UserLocalRepository } from './UserLocalRepository';
import config from '@infrastructure/config';
import { UserSqlRepository } from './UserSqlRepository';

export class UserFactoryRepository {
  static instance: UserInterfaceRepository | null = null;

  static getInstance(): UserInterfaceRepository {
    if (!UserFactoryRepository.instance) {
      if (config.ENV === 'TEST') {
        const userRepository = new UserLocalRepository();
        UserFactoryRepository.instance = userRepository;
      } else {
        const userRepository = new UserSqlRepository();
        UserFactoryRepository.instance = userRepository;
      }
    }
    return UserFactoryRepository.instance;
  }
}
