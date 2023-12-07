import { Email } from '../Email';
import { Password } from '../Password';

export class User {
  constructor(
    private email: Email,
    private firtname: string,
    private lastname: string,
    private dateBirth: string, //'dd-mm-aaaa'
    private objective: string,
    private lastSession: string, //timestamp
    private password: Password
  ) {}

  changePassword(newPassword: Password) {
    this.password = newPassword;
  }

  isEqual(user: User): boolean {
    return this.email === user.email;
  }

  getJSON() {
    return {
      email: this.email,
      firtname: this.firtname,
      lastname: this.lastname,
      dateBirth: this.dateBirth,
      objective: this.objective,
      lastSession: this.lastSession,
      password: this.password,
    };
  }
}
