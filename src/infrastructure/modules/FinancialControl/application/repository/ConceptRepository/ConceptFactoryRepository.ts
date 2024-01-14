import { ConceptInterfaceRepository } from './ConceptInterfaceRepository';
import { ConceptSqlRepository } from './ConceptSqlRepository';

export class ConceptFactoryRepository {
  static instance: ConceptInterfaceRepository | null = null;

  static getInstance(): ConceptInterfaceRepository {
    if (!ConceptFactoryRepository.instance) {
      const userRepository = new ConceptSqlRepository();
      ConceptFactoryRepository.instance = userRepository;
    }
    return ConceptFactoryRepository.instance;
  }
}
