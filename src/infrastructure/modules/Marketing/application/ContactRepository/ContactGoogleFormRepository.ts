import { ContactInterfaceRepository } from './ContactInterfaceRepository';
import { Contact } from './models/Contact';

export class ContactGoogleFormRepository implements ContactInterfaceRepository {
  saveContactForm(contact: Contact): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://docs.google.com/forms/d/e/1FAIpQLSdMURMRgHx6KBNgnMfyeinHmh_MdfcXv3VViiVN0vbbybBDRQ/formResponse?` +
          new URLSearchParams({
            'entry.937915450': contact.name,
            'entry.1889619595': contact.email,
            'entry.546758487': contact.subject,
            'entry.1737': contact.description,
            submit: 'Submit',
          }),
        {
          mode: 'no-cors',
        }
      )
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }
}
