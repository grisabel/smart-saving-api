import { Email } from '../Email';
import { Password } from '../Password';
import { UserError } from './UserError';

export class User {
  constructor(
    private email: Email,
    private firstname: string,
    private lastname: string,
    private dateBirth: string, //'dd-mm-aaaa'
    private objective: string,
    private password: Password
  ) {}

  changePassword(newPassword: Password): void {
    if (this.password.isEqual(newPassword)) {
      throw new UserError();
    }
    this.password = newPassword;
  }

  isEqual(user: User): boolean {
    return this.email.isEqual(user.email);
  }

  getValue() {
    return {
      email: this.email.getValue(),
      firtname: this.firstname,
      lastname: this.lastname,
      dateBirth: this.dateBirth,
      objective: this.objective,
      password: this.password.getValue(),
    };
  }

  public getEmail(): Email {
    return this.email;
  }

  public getFirtname(): string {
    return this.firstname;
  }

  public getLastname(): string {
    return this.lastname;
  }

  public getDateBirth(): string {
    return this.dateBirth;
  }

  public getObjective(): string {
    return this.objective;
  }

  public getPassword(): Password {
    return this.password;
  }
}
