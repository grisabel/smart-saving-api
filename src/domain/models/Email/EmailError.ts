import { DomainError } from '../Error/DomainError';

//TODO review texts
export const EMAIL_ERRORS = {
  format:
    'El email no tiene un formato válido <nombre>@<dominio>.<extensión_de_dominio>',
};

interface EmailErrorParmas {
  format?: string;
}

export class EmailError extends DomainError<EmailErrorParmas> {
  static msg: string = 'EmailError';
  constructor() {
    super(EmailError.msg, EMAIL_ERRORS);
  }
}
