import { Contact } from './models/Contact';

export abstract class ContactInterfaceRepository {
  abstract saveContactForm(contact: Contact): Promise<void>;
}
