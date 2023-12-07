import { Email } from '@domain/models/Email';
import { User } from '@domain/models/User';

export interface UserInterfaceRepository {
  save(user: User): Promise<void>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(email: Email): Promise<void>;
  update(user: User): Promise<void>;
}
