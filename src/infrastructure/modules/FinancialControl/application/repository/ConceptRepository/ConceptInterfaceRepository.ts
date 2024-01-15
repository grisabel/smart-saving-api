import { Concept } from './models/Concept';
import { Email } from '@domain/models/Email';

//TODO review texts
export const CONCEPT_REPOSITORY_ERROR = {
  conceptIdNotExist: 'El concepto no existe',
  conceptDuplicate: 'Concepto duplicado',
};
export interface FinancialAccountRepositoryErrorParams {
  conceptIdNotExist?: string;
  conceptDuplicate?: string;
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
  addInitialData(email: Email): Promise<void>;
  addExpense(email: Email, concept: string): Promise<Concept>;
  addIncome(email: Email, concept: string): Promise<Concept>;
  readAllExpense(email: Email): Promise<Concept[]>;
  readAllIncome(email: Email): Promise<Concept[]>;
  deleteExpense(email: Email, conceptId: string): Promise<void>;
  deleteIncome(email: Email, conceptId: string): Promise<void>;
}
