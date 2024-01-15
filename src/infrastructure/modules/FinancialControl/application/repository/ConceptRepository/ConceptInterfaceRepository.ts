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

export abstract class ConceptInterfaceRepository {
  static DEFAULT_INCOME = [
    { id: 'EXPENSE-1', concept: 'Nómina' },
    { id: 'EXPENSE-2', concept: 'Rentas' },
    { id: 'EXPENSE-3', concept: 'Becas/Subvenciones' },
    { id: 'EXPENSE-4', concept: 'Apuestas/Juego' },
  ];

  static DEFAULT_EXPENSE = [
    { id: 'INCOME-1', concept: 'Hipoteca/Alquiler/Comunidad' },
    { id: 'INCOME-2', concept: 'Alimentación' },
    { id: 'INCOME-3', concept: 'Mascotas' },
    { id: 'INCOME-4', concept: 'Combustible' },
    { id: 'INCOME-5', concept: 'Luz' },
    { id: 'INCOME-6', concept: 'Calefacción' },
    { id: 'INCOME-7', concept: 'Telefonía/Internet' },
    { id: 'INCOME-8', concept: 'Agua' },
    { id: 'INCOME-9', concept: 'Estudios' },
    { id: 'INCOME-10', concept: 'Ocio' },
    { id: 'INCOME-11', concept: 'Tasas/Impuestos/Multas' },
    { id: 'INCOME-12', concept: 'Educación' },
    { id: 'INCOME-13', concept: 'Salud' },
    { id: 'INCOME-14', concept: 'Seguros' },
    { id: 'INCOME-15', concept: 'Coche' },
  ];
  abstract addInitialData(email: Email): Promise<void>;
  abstract addExpense(email: Email, concept: string): Promise<Concept>;
  abstract addIncome(email: Email, concept: string): Promise<Concept>;
  abstract readAllExpense(email: Email): Promise<Concept[]>;
  abstract readAllIncome(email: Email): Promise<Concept[]>;
  abstract deleteExpense(email: Email, conceptId: string): Promise<void>;
  abstract deleteIncome(email: Email, conceptId: string): Promise<void>;
}
