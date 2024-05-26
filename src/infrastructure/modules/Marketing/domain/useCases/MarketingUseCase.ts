import { ContactInterfaceRepository } from '@Marketing/application/ContactRepository/ContactInterfaceRepository';
import { ConceptFactoryRepository } from '@Marketing/application/ContactRepository/ContactFactoryRepository';
import { ContactFormRequestModel } from '../../infrastructure/dtos/request/ContactFormRequestModel';

export class MarketingUseCase {
  constructor(private contactRepository: ContactInterfaceRepository) {}

  createContactForm(
    contactForm: ContactFormRequestModel
  ): Promise<[Error, null]> {
    return new Promise(async (resolve, reject) => {
      try {
        this.contactRepository.saveContactForm(contactForm);
        resolve([null, null]);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export class MarketingUseCaseFactory {
  static instance: MarketingUseCase | null = null;

  static getIntance(): MarketingUseCase {
    if (!MarketingUseCaseFactory.instance) {
      const contactRepository = ConceptFactoryRepository.getInstance();

      MarketingUseCaseFactory.instance = new MarketingUseCase(
        contactRepository
      );
    }
    return MarketingUseCaseFactory.instance;
  }
}
