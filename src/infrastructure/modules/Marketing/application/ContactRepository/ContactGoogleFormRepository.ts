import config from '@infrastructure/config';
import { ContactInterfaceRepository } from './ContactInterfaceRepository';
import { Contact } from './models/Contact';

export class ContactGoogleFormRepository implements ContactInterfaceRepository {
  saveContactForm(contact: Contact): Promise<void> {
    return new Promise((resolve, reject) => {
      const fields = {};
      fields[config.GOOGLE_FORM.FORM_FIELD_NAME] = contact.name;
      fields[config.GOOGLE_FORM.FORM_FIELD_EMAIL] = contact.email;
      fields[config.GOOGLE_FORM.FORM_FIELD_SUBJECT] = contact.subject;
      fields[config.GOOGLE_FORM.FORM_FIELD_DESCRIPTION] = contact.description;

      fetch(
        `https://docs.google.com/forms/d/e/${config.GOOGLE_FORM.FORM_ID}/formResponse?` +
          new URLSearchParams({
            ...fields,
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
