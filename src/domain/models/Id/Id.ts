import IdService from '../../../application/services/IdService';

export class Id {
  static createId(): Id {
    const idGenerate = IdService.generateId();
    return new Id(idGenerate);
  }

  static createFrom(id: string): Id {
    return new Id(id);
  }

  private constructor(private value: string) {}

  isEqual(id: Id) {
    return this.value === id.value;
  }

  getValue() {
    return this.value;
  }
}
