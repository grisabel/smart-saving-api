import { Email } from '../../../domain/models/Email';
import { User } from '../../../domain/models/User';

//TODO review texts
export const USER_REPOSITORY_ERROR = {
  userNotExist: 'El usuario no existe',
  userDuplicate: 'El email del usuario ya existe',
};
export interface UserRepositoryErrorParams {
  userNotExist?: string;
  userDuplicate?: string;
}

export class UserRepositoryError extends Error {
  static msg: string = 'UserRepositoryError';
  public data: UserRepositoryErrorParams;

  constructor(data: UserRepositoryErrorParams) {
    super(UserRepositoryError.msg);
    this.data = data;
  }
}

export interface UserInterfaceRepository {
  save(user: User): Promise<void>;
  findByEmail(email: Email): Promise<User>;
  findAll(): Promise<User[]>;
  delete(email: Email): Promise<void>;
  update(user: User): Promise<void>;
}
