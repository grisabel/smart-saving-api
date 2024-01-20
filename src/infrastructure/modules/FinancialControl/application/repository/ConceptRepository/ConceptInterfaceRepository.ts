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
    { id: 'INCOME-1', concept: 'Nómina' },
    { id: 'INCOME-2', concept: 'Rentas' },
    { id: 'INCOME-3', concept: 'Becas/Subvenciones' },
    { id: 'INCOME-4', concept: 'Apuestas/Juego' },
  ];

  static DEFAULT_EXPENSE = [
    { id: 'EXPENSE-1', concept: 'Hipoteca/Alquiler/Comunidad' },
    { id: 'EXPENSE-2', concept: 'Alimentación' },
    { id: 'EXPENSE-3', concept: 'Mascotas' },
    { id: 'EXPENSE-4', concept: 'Combustible' },
    { id: 'EXPENSE-5', concept: 'Luz' },
    { id: 'EXPENSE-6', concept: 'Calefacción' },
    { id: 'EXPENSE-7', concept: 'Telefonía/Internet' },
    { id: 'EXPENSE-8', concept: 'Agua' },
    { id: 'EXPENSE-9', concept: 'Estudios' },
    { id: 'EXPENSE-10', concept: 'Ocio' },
    { id: 'EXPENSE-11', concept: 'Tasas/Impuestos/Multas' },
    { id: 'EXPENSE-12', concept: 'Educación' },
    { id: 'EXPENSE-13', concept: 'Salud' },
    { id: 'EXPENSE-14', concept: 'Seguros' },
    { id: 'EXPENSE-15', concept: 'Coche' },
  ];
  abstract addInitialData(email: Email): Promise<void>;
  abstract addExpense(email: Email, concept: string): Promise<Concept>;
  abstract addIncome(email: Email, concept: string): Promise<Concept>;
  abstract readAllExpense(email: Email): Promise<Concept[]>;
  abstract readAllIncome(email: Email): Promise<Concept[]>;
  abstract deleteExpense(email: Email, conceptId: string): Promise<void>;
  abstract deleteIncome(email: Email, conceptId: string): Promise<void>;
}
