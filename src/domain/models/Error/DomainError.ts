export class DomainError<T> extends Error {
  // TODO extends
  static msg: string;
  public data: T;

  constructor(msg: string, data: T) {
    super(DomainError.msg);
    this.data = data;
  }
}
