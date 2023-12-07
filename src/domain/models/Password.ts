export const PASSWORD_ERRORS = {
  length: 'La contraseña debe tener al menos 6 caracteres.',
  number: 'La contraseña debe contener al menos un número.',
  upperCase: 'La contraseña debe contener al menos una letra mayúscula.',
  lowerCase: 'La contraseña debe contener al menos una letra minúscula.',
  specialChar:
    'La contraseña debe contener al menos alguno de los siguientes caracteres: _ @ # !',
};
const MINLENGTH = 6;

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

export class Password {
  private constructor(private password: string) {}

  static createFromText(password: string): Password {
    this.ensureRules(password);

    return new Password(password);
  }

  static ensureRules(password: string): void {
    const errorsPasswordMap = new Map<string, string>();

    if (!this.hasMinLength(password)) {
      errorsPasswordMap.set('length', PASSWORD_ERRORS.length);
    }
    if (!this.hasNumber(password)) {
      errorsPasswordMap.set('number', PASSWORD_ERRORS.number);
    }
    if (!this.hasUpperCase(password)) {
      errorsPasswordMap.set('upperCase', PASSWORD_ERRORS.upperCase);
    }
    if (!this.hasLowerCase(password)) {
      errorsPasswordMap.set('lowerCase', PASSWORD_ERRORS.lowerCase);
    }
    if (!this.hasSpecialChar(password)) {
      errorsPasswordMap.set('specialChar', PASSWORD_ERRORS.specialChar);
    }

    if (errorsPasswordMap.size > 0) {
      throw new PasswordError(Object.fromEntries(errorsPasswordMap));
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
