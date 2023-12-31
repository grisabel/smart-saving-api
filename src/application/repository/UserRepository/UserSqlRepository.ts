import { prisma } from '@application/repository/db';

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

prisma;

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
          reject(error);
        });
    });
  }

  async delete(email: Email): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.user
        .delete({
          where: {
            email: email.getValue(),
          },
        })
        .then(() => {
          resolve();
        })
        .catch(() => {
          const error = new UserRepositoryError({
            userNotExist: USER_REPOSITORY_ERROR.userNotExist,
          });
          reject(error);
        });
    });
  }

  async update(user: User): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const userResult = await prisma.user.update({
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
          },
        });

        await prisma.password.update({
          where: {
            userId: userResult.id,
          },
          data: {
            hash: Password.createHash(user.getPassword().getValue()).getValue(),
          },
        });
        resolve();
      } catch (error) {
        const errorUser = new UserRepositoryError({
          userNotExist: USER_REPOSITORY_ERROR.userNotExist,
        });
        reject(errorUser);
      }
    });
  }
}
