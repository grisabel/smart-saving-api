import config from '@infrastructure/config';
import { OperationsIdInterfaceRepository } from './OperationIdInterfaceRepository';
import { OperationsIdLocalRepository } from './OperationsIdLocalRepository';
import { OperationsIdSqlRepository } from './OperationsIdSqlRepository';

export class OperationsIdFactoryRepository {
  static instance: OperationsIdInterfaceRepository | null = null;

  static getInstance(): OperationsIdInterfaceRepository {
    if (config.ENV === 'TEST') {
      const userRepository = new OperationsIdLocalRepository();
      OperationsIdFactoryRepository.instance = userRepository;
    } else {
      const userRepository = new OperationsIdSqlRepository();
      OperationsIdFactoryRepository.instance = userRepository;
    }
    return OperationsIdFactoryRepository.instance;
  }
}
