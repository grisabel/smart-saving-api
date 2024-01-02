import { EmailError } from './EmailError';

export class Email {
  static createFromText(value: string): Email {
    Email.ensureEmail(value);

    return new Email(value);
  }

  static ensureEmail(value: string): void {
    if (!Email.isValid(value)) {
      throw new EmailError();
    }
  }

  static isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value);
  }

  private constructor(private value: string) {}

  isEqual(email: Email): boolean {
    return this.value === email.value;
  }

  getValue() {
    return this.value;
  }
}
