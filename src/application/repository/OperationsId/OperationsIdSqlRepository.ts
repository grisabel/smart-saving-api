import { Id } from '@domain/models/Id/Id';
import {
  OPERATIONSID_REPOSITORY_ERROR,
  OperationsIdInterfaceRepository,
  OperationsIdRepositoryError,
} from './OperationIdInterfaceRepository';
import { Operation, OperationType } from './models/OperationId';
import { DDBBConnectionError, prisma } from '@application/repository/db';
import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import {
  USER_REPOSITORY_ERROR,
  UserRepositoryError,
} from '../UserRepository/UserInterfaceRepository';

export class OperationsIdSqlRepository
  implements OperationsIdInterfaceRepository
{
  async save(operation: Operation): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: operation.email },
        });

        if (!user) {
          reject(
            new UserRepositoryError({
              userNotExist: USER_REPOSITORY_ERROR.userNotExist,
            })
          );
        }

        await prisma.operation.create({
          data: {
            userEmail: operation.email,
            expiresIn: DateTimeService.parse(
              {
                date: `${operation.expiresIn}`,
                format: DATE_FORMATS.TimestampMs,
              },
              DATE_FORMATS.ISO_8601
            ),
            id: operation.id,
            type: operation.type,
          },
        });
        resolve();
      } catch (error) {
        if (error.name == 'PrismaClientInitializationError') {
          reject(new DDBBConnectionError());
          return;
        }
        if (error?.code === 'P2002') {
          reject(
            new OperationsIdRepositoryError({
              idDuplicate: OPERATIONSID_REPOSITORY_ERROR.idDuplicate,
            })
          );
          return;
        }
        reject(error);
      }
    });
  }

  async find(id: Id): Promise<Operation> {
    return new Promise((resolve, reject) => {
      prisma.operation
        .findUnique({ where: { id: id.getValue() }, include: { user: true } })
        .then((operation) => {
          resolve({
            email: operation.user.email,
            expiresIn: `${operation.expiresIn.getTime()}`,
            id: operation.id,
            type: OperationType[operation.type],
          });
        })
        .catch((error) => {
          if (error.name == 'PrismaClientInitializationError') {
            reject(new DDBBConnectionError());
            return;
          }
          reject(
            new OperationsIdRepositoryError({
              idNotExist: OPERATIONSID_REPOSITORY_ERROR.idNotExist,
            })
          );
        });
    });
  }

  async delete(id: Id): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.operation
        .delete({
          where: {
            id: id.getValue(),
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
            new OperationsIdRepositoryError({
              idNotExist: OPERATIONSID_REPOSITORY_ERROR.idNotExist,
            })
          );
        });
    });
  }
}
