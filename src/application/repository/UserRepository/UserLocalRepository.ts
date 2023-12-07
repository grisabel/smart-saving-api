import { Email } from '@domain/models/Email';
import { User } from '@domain/models/User';
import { UserInterfaceRepository } from './UserInterfaceRepository';

export class UserLocalRepository implements UserInterfaceRepository {
  private localUsers: User[] = [];

  async save(user: User): Promise<void> {
    this.localUsers.push(user);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const filterArray = this.localUsers.filter((user) => {
      return email.isEqual(user.getEmail());
    });

    return filterArray.length === 0 ? null : filterArray[0];
  }

  async findAll(): Promise<User[]> {
    return this.localUsers;
  }

  async delete(email: Email): Promise<void> {
    const filterArray = this.localUsers.filter((user) => {
      return email.isEqual(user.getEmail());
    });

    if (filterArray.length === 0) {
      throw new Error('User not exist');
    }

    this.localUsers = filterArray;
  }

  async update(user: User): Promise<void> {
    const filterArray = this.localUsers.map((userLocal) => {
      if (userLocal.isEqual(user)) {
        return user;
      }
      return userLocal;
    });

    if (filterArray.length === 0) {
      throw new Error('User not exist');
    }

    this.localUsers = filterArray;
  }
}
