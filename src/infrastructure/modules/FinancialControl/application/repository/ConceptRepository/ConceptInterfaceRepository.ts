import { Concept } from './models/Concept';
import { Email } from '@domain/models/Email';

//TODO review texts
export const CONCEPT_REPOSITORY_ERROR = {
  conceptIdNotExist: 'El concepto no existe',
};
export interface FinancialAccountRepositoryErrorParams {
  conceptIdNotExist?: string;
}

export class ConceptRepositoryError extends Error {
  static msg: string = 'ConceptRepositoryError';
  public data: FinancialAccountRepositoryErrorParams;

  constructor(data: FinancialAccountRepositoryErrorParams) {
    super(ConceptRepositoryError.msg);
    this.data = data;
  }
}

export interface ConceptInterfaceRepository {
  addExpense(email: Email, concept: string): Promise<void>;
  addIncome(email: Email, concept: string): Promise<void>;
  readAllExpense(email: Email): Promise<Concept[]>;
  readAllIncome(email: Email): Promise<Concept[]>;
  deleteExpense(email: Email, conceptId: string): Promise<void>;
  deleteIncome(email: Email, conceptId: string): Promise<void>;
}
