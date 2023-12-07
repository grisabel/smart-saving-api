export class EmailError extends Error {
  static msg: string = 'EmailError';
  constructor() {
    super(EmailError.msg);
  }
}
