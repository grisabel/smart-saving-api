import { TransactionInterfaceRepository } from './TransactionInterfaceRepository';
import { TransactionSqlRepository } from './TransactionSqlRepository';

export class TransactionFactoryRepository {
  static instance: TransactionInterfaceRepository | null = null;

  static getInstance(): TransactionInterfaceRepository {
    if (!TransactionFactoryRepository.instance) {
      const userRepository = new TransactionSqlRepository();
      TransactionFactoryRepository.instance = userRepository;
    }
    return TransactionFactoryRepository.instance;
  }
}
