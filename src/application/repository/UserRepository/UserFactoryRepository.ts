import { UserExample } from '@domain/models/User/test/User.example';
import { UserInterfaceRepository } from './UserInterfaceRepository';
import { UserLocalRepository } from './UserLocalRepository';

export class UserFactoryRepository {
  static instance: UserInterfaceRepository | null = null;

  static getInstance(): UserInterfaceRepository {
    if (!UserFactoryRepository.instance) {
      const userRepository = new UserLocalRepository();
      UserFactoryRepository.instance = userRepository;

      const user1 = UserExample.user1_text();
      const realUser = UserExample.real_user_text();

      userRepository.save(user1);
      userRepository.save(realUser);
    }
    return UserFactoryRepository.instance;
  }
}
