import { Email } from '../../../domain/models/Email';
import { User } from '../../../domain/models/User';
import {
  USER_REPOSITORY_ERROR,
  UserInterfaceRepository,
  UserRepositoryError,
} from './UserInterfaceRepository';

import { Password } from '../../../domain/models/Password';
export class UserLocalRepository implements UserInterfaceRepository {
  private localUsers: User[] = [];

  async save(user: User): Promise<void> {
    const _email = user.getEmail();
    const _password = Password.createFromHash(user.getPassword().getValue());
    const _user = new User(
      _email,
      user.getFirtname(),
      user.getLastname(),
      user.getDateBirth(),
      user.getObjective(),
      user.getLastSession(),
      _password
    );
    return new Promise((resolve) => {
      this.localUsers.push(_user);
      resolve();
    });
  }

  async findByEmail(email: Email): Promise<User> {
    return new Promise((resolve, reject) => {
      const filterArray = this.localUsers.filter((user) => {
        return email.isEqual(user.getEmail());
      });

      if (filterArray.length === 0) {
        const error = new UserRepositoryError({
          userNotExist: USER_REPOSITORY_ERROR.userNotExist,
        });
        reject(error);
      } else {
        resolve(filterArray[0]);
      }
    });
  }

  async findAll(): Promise<User[]> {
    return new Promise((resolve) => {
      resolve(this.localUsers);
    });
  }

  async delete(email: Email): Promise<void> {
    return new Promise((resolve, reject) => {
      const filterArray = this.localUsers.filter((user) => {
        return email.isEqual(user.getEmail());
      });

      if (filterArray.length === 0) {
        const error = new UserRepositoryError({
          userNotExist: USER_REPOSITORY_ERROR.userNotExist,
        });
        reject(error);
      } else {
        this.localUsers = filterArray;
        resolve();
      }
    });
  }

  async update(user: User): Promise<void> {
    const _email = user.getEmail();
    const _password = Password.createFromHash(user.getPassword().getValue());
    const _user = new User(
      _email,
      user.getFirtname(),
      user.getLastname(),
      user.getDateBirth(),
      user.getObjective(),
      user.getLastSession(),
      _password
    );

    return new Promise((resolve, reject) => {
      const updateArray = this.localUsers.map((userLocal) => {
        if (userLocal.isEqual(user)) {
          return _user;
        }
        return userLocal;
      });

      if (updateArray.length === 0) {
        const error = new UserRepositoryError({
          userNotExist: USER_REPOSITORY_ERROR.userNotExist,
        });
        reject(error);
      } else {
        this.localUsers = updateArray;
        resolve();
      }
    });
  }
}
