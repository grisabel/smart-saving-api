import { DomainError } from '../Error/DomainError';

//Todo añadir data
export class EmailError extends DomainError<null> {
  static msg: string = 'EmailError';
  constructor() {
    super(DomainError.msg, null);
  }
}
