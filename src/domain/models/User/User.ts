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
}
