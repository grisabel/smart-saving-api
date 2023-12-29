import { PASSWORD_ERRORS, PasswordError } from './PasswordError';
import HashService from '@application/services/HashService';

const MINLENGTH = 6;

export class Password {
  static createFromText(value: string): Password {
    this.ensureRules(value);

    return new Password(value, false);
  }

  static createHash(value: string): Password {
    return new Password(HashService.generateHash(value), true);
  }

  static ensureRules(value: string): void {
    const errorsPasswordMap = new Map<string, string>();

    if (!Password.hasMinLength(value)) {
      errorsPasswordMap.set('length', PASSWORD_ERRORS.length);
    }
    if (!Password.hasNumber(value)) {
      errorsPasswordMap.set('number', PASSWORD_ERRORS.number);
    }
    if (!Password.hasUpperCase(value)) {
      errorsPasswordMap.set('upperCase', PASSWORD_ERRORS.upperCase);
    }
    if (!Password.hasLowerCase(value)) {
      errorsPasswordMap.set('lowerCase', PASSWORD_ERRORS.lowerCase);
    }
    if (!Password.hasSpecialChar(value)) {
      errorsPasswordMap.set('specialChar', PASSWORD_ERRORS.specialChar);
    }

    if (errorsPasswordMap.size > 0) {
      throw new PasswordError(Object.fromEntries(errorsPasswordMap));
    }
  }

  static hasMinLength(value: string): boolean {
    return value.length >= MINLENGTH;
  }
  static hasNumber(value: string): boolean {
    return /\d/.test(value);
  }
  static hasUpperCase(value: string): boolean {
    return /[A-Z]/.test(value);
  }
  static hasLowerCase(value: string): boolean {
    return /[a-z]/.test(value);
  }
  static hasSpecialChar(value: string): boolean {
    return /[_@#!]/.test(value);
  }

  private constructor(private value: string, public isHashed: boolean) {}

  isEqual(password: Password): boolean {
    return this.value === password.value;
  }

  hash(): string {
    return HashService.generateHash(this.value);
  }

  getValue() {
    return this.value;
  }
}
