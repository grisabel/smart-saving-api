import IdService from '@application/services/IdService';

export class Id {
  static createId(): Id {
    const idGenerate = IdService.generateId();
    return new Id(idGenerate);
  }

  private constructor(private value: string) {}
}
