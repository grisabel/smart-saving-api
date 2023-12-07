//TODO review texts
export const PASSWORD_ERRORS = {
  length: 'La contraseña debe tener al menos 6 caracteres.',
  number: 'La contraseña debe contener al menos un número.',
  upperCase: 'La contraseña debe contener al menos una letra mayúscula.',
  lowerCase: 'La contraseña debe contener al menos una letra minúscula.',
  specialChar:
    'La contraseña debe contener al menos alguno de los siguientes caracteres: _ @ # !',
};
interface PasswordErrorParams {
  length?: string;
  number?: string;
  upperCase?: string;
  lowerCase?: string;
  specialChar?: string;
}

export class PasswordError extends Error {
  static id: string = 'PasswordError';
  public data: PasswordErrorParams;

  constructor(data: PasswordErrorParams) {
    super(PasswordError.id);
    this.data = data;
  }
}
