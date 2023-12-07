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

  findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  delete(email: Email): Promise<void> {
    throw new Error('Method not implemented.');
  }

  update(user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
