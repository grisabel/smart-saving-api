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
  private constructor(private password: string) {}

  static createFromText(password: string): Password {
    this.ensureRules(password);

    return new Password(password);
  }

  static ensureRules(password: string): void {
    if (!this.hasMinLength(password)) {
      throw new Error(ERRORS.length);
    }
    if (!this.hasNumber(password)) {
      throw new Error(ERRORS.number);
    }
    if (!this.hasUpperCase(password)) {
      throw new Error(ERRORS.upperCase);
    }
    if (!this.hasLowerCase(password)) {
      throw new Error(ERRORS.lowerCase);
    }
    if (!this.hasSpecialChar(password)) {
      throw new Error(ERRORS.specialChar);
    }
  }

  static hasMinLength(password: string): boolean {
    return password.length >= MINLENGTH;
  }
  static hasNumber(password: string): boolean {
    return /\d/.test(password);
  }
  static hasUpperCase(password: string): boolean {
    return /[A-Z]/.test(password);
  }
  static hasLowerCase(password: string): boolean {
    return /[a-z]/.test(password);
  }
  static hasSpecialChar(password: string): boolean {
    return /[_@#!]/.test(password);
  }
}
