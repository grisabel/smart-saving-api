import IdService from '@application/services/IdService';
import { IDError, ID_ERRORS } from './IdError';

export class Id {
  static createId(): Id {
    const idGenerate = IdService.generateId();
    return new Id(idGenerate);
  }

  static createFrom(id: string): Id {
    if (!IdService.isValid(id)) {
      throw new IDError({ format: ID_ERRORS.format });
    }
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
