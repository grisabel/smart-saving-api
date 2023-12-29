import { OperationsIdInterfaceRepository } from './OperationIdInterfaceRepository';
import { OperationsIdLocalRepository } from './OperationsIdLocalRepository';

export class OperationsIdFactoryRepository {
  static instance: OperationsIdInterfaceRepository | null = null;

  static getInstance(): OperationsIdInterfaceRepository {
    if (!OperationsIdFactoryRepository.instance) {
      const userRepository = new OperationsIdLocalRepository();
      OperationsIdFactoryRepository.instance = userRepository;
    }
    return OperationsIdFactoryRepository.instance;
  }
}
