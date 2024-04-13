import { ContactGoogleFormRepository } from './ContactGoogleFormRepository';
import { ContactInterfaceRepository } from './ContactInterfaceRepository';

export class ConceptFactoryRepository {
  static instance: ContactInterfaceRepository | null = null;

  static getInstance(): ContactInterfaceRepository {
    if (!ConceptFactoryRepository.instance) {
      const userRepository = new ContactGoogleFormRepository();
      ConceptFactoryRepository.instance = userRepository;
    }
    return ConceptFactoryRepository.instance;
  }
}
