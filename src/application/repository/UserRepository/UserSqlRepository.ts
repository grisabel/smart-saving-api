import { DDBBConnectionError, prisma } from '@application/repository/db';

import {
  USER_REPOSITORY_ERROR,
  UserInterfaceRepository,
  UserRepositoryError,
} from './UserInterfaceRepository';
import { User } from '@domain/models/User';
import { Password } from '@domain/models/Password';
import { Email } from '@domain/models/Email';
import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';

export class UserSqlRepository implements UserInterfaceRepository {
  async save(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.user
        .create({
          data: {
            firstname: user.getFirtname(),
            lastname: user.getLastname(),
            dateBirth: DateTimeService.parse(
              {
                date: user.getDateBirth(),
                format: DATE_FORMATS.Date,
              },
              DATE_FORMATS.ISO_8601
            ),
            objective: user.getObjective(),
            email: user.getEmail().getValue(),
            Password: {
              create: {
                hash: Password.createHash(
                  user.getPassword().getValue()
                ).getValue(),
              },
            },
          },
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          if (error?.code === 'P2002') {
            reject(
              new UserRepositoryError({
                userDuplicate: USER_REPOSITORY_ERROR.userDuplicate,
              })
            );
            return;
          }
          reject(error);
        });
    });
  }

  async findByEmail(email: Email): Promise<User> {
    return new Promise((resolve, reject) => {
      prisma.user
        .findUnique({
          where: {
            email: email.getValue(),
          },
          include: {
            Password: true,
          },
        })
        .then((user) => {
          resolve(
            new User(
              Email.createFromText(user.email),
              user.firstname,
              user.lastname,
              DateTimeService.parse(
                {
                  date: `${user.dateBirth.getTime()}`,
                  format: DATE_FORMATS.TimestampMs,
                },
                DATE_FORMATS.Date
              ),
              user.objective,
              Password.createFromHash(user.Password.hash)
            )
          );
        })
        .catch((error) => {
          if (error.name == 'PrismaClientInitializationError') {
            reject(new DDBBConnectionError());
            return;
          }
          reject(
            new UserRepositoryError({
              userNotExist: USER_REPOSITORY_ERROR.userNotExist,
            })
          );
        });
    });
  }

  async findAll(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      prisma.user
        .findMany({ include: { Password: true } })
        .then((users) => {
          resolve(
            users.map((user) => {
              return new User(
                Email.createFromText(user.email),
                user.firstname,
                user.lastname,
                DateTimeService.parse(
                  {
                    date: `${user.dateBirth.getTime()}`,
                    format: DATE_FORMATS.TimestampMs,
                  },
                  DATE_FORMATS.Date
                ),
                user.objective,
                Password.createFromHash(user.Password.hash)
              );
            })
          );
        })
        .catch((error) => {
          if (error.name == 'PrismaClientInitializationError') {
            reject(new DDBBConnectionError());
            return;
          }
          reject(error);
        });
    });
  }

  async delete(email: Email): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.user
        .update({
          where: {
            email: email.getValue(),
          },
          data: {
            deleteIn: DateTimeService.parse(
              {
                date: `${new Date().getTime()}`,
                format: DATE_FORMATS.TimestampMs,
              },
              DATE_FORMATS.ISO_8601
            ),
          },
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          if (error.name == 'PrismaClientInitializationError') {
            reject(new DDBBConnectionError());
            return;
          }

          reject(
            new UserRepositoryError({
              userNotExist: USER_REPOSITORY_ERROR.userNotExist,
            })
          );
        });
    });
  }

  async update(user: User): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await prisma.user.update({
          where: {
            email: user.getEmail().getValue(),
          },
          data: {
            firstname: user.getFirtname(),
            lastname: user.getLastname(),
            dateBirth: DateTimeService.parse(
              {
                date: user.getDateBirth(),
                format: DATE_FORMATS.Date,
              },
              DATE_FORMATS.ISO_8601
            ),
            objective: user.getObjective(),
            email: user.getEmail().getValue(),
            deleteIn: user.getDeleteIn(),
          },
        });

        try {
          Password.createFromText(user.getPassword().getValue()); // todo
          const passwordHash = Password.createHash(
            user.getPassword().getValue()
          );
          await prisma.password.update({
            where: {
              userEmail: user.getEmail().getValue(),
            },
            data: {
              hash: passwordHash.getValue(),
            },
          });
        } catch (error) {}

        resolve();
      } catch (error) {
        if (error.name == 'PrismaClientInitializationError') {
          reject(new DDBBConnectionError());
          return;
        }
        const errorUser = new UserRepositoryError({
          userNotExist: USER_REPOSITORY_ERROR.userNotExist,
        });
        reject(errorUser);
      }
    });
  }
}
