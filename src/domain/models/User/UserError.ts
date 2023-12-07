//TODO review texts
export const USER_ERRORS = {
  samePassword: 'La nueva contraseña no debe coincidir con la antigua.',
};
interface UserErrorParams {
  samePassword?: string;
}
export class UserError extends Error {
  static msg: string = 'UserError';
  public data: UserErrorParams;

  constructor() {
    super(UserError.msg);
    this.data = { samePassword: USER_ERRORS.samePassword };
  }
}
