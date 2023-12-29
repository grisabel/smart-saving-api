import { DomainError } from '../Error/DomainError';

//TODO review texts
export const ID_ERRORS = {
  format: 'El formato del id no es válido.',
};
interface IDErrorParams {
  format: string;
}

export class IDError extends DomainError<IDErrorParams> {
  static msg: string = 'IDError';

  constructor(data: IDErrorParams) {
    super(IDError.msg, data);
  }
}
