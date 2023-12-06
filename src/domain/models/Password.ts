export const ERRORS = {
  length: 'La contraseña debe tener al menos 6 caracteres.',
  number: 'La contraseña debe contener al menos un número.',
  upperCase: 'La contraseña debe contener al menos una letra mayúscula.',
  lowerCase: 'La contraseña debe contener al menos una letra minúscula.',
  specialChar:
    'La contraseña debe contener al menos alguno de los siguientes caracteres: _ @ # !',
};
const MINLENGTH = 6;

export class Password {
  private password: string;

  constructor(password: string) {
    this.ensureMinLength(password);
    this.ensureNumber(password);
    this.ensureUpperCase(password);
    this.ensureLowerCase(password);
    this.ensureSpecialChar(password);

    this.password = password;
  }

  ensureMinLength(password: string): void {
    if (password.length < MINLENGTH) {
      throw new Error(ERRORS.length);
    }
  }
  ensureNumber(password: string): void {
    if (!/\d/.test(password)) {
      throw new Error(ERRORS.number);
    }
  }
  ensureUpperCase(password: string): void {
    if (!/[A-Z]/.test(password)) {
      throw new Error(ERRORS.upperCase);
    }
  }
  ensureLowerCase(password: string): void {
    if (!/[a-z]/.test(password)) {
      throw new Error(ERRORS.lowerCase);
    }
  }
  ensureSpecialChar(password: string): void {
    if (!/[_@#!]/.test(password)) {
      throw new Error(ERRORS.specialChar);
    }
  }
}
