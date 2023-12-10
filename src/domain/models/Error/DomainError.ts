export class DomainError<T> extends Error {
  // TODO extends
  public data: T;

  constructor(msg: string, data: T) {
    super(msg);
    this.data = data;
  }
}
