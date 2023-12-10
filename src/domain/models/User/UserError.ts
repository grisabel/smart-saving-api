import { DomainError } from '../Error/DomainError';

//TODO review texts
export const USER_ERRORS = {
  samePassword: 'La nueva contraseña no debe coincidir con la antigua.',
};
interface UserErrorParams {
  samePassword?: string;
}
export class UserError extends DomainError<UserErrorParams> {
  static msg: string = 'UserError';
  public data: UserErrorParams;

  constructor() {
    const data = { samePassword: USER_ERRORS.samePassword };
    super(UserError.msg, data);
  }
}
