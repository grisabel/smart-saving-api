import { ContactInterfaceRepository } from './ContactInterfaceRepository';
import { Contact } from './models/Contact';

export class ContactGoogleFormRepository implements ContactInterfaceRepository {
  saveContactForm(contact: Contact): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(
        `https://docs.google.com/forms/d/e/1FAIpQLSdMURMRgHx6KBNgnMfyeinHmh_MdfcXv3VViiVN0vbbybBDRQ/viewform?usp=pp_url` +
          new URLSearchParams({
            'entry.937915450': encodeURI(contact.name),
            'entry.1889619595': encodeURI(contact.email),
            'entry.546758487': encodeURI(contact.subject),
            'entry.1737': encodeURI(contact.description),
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
