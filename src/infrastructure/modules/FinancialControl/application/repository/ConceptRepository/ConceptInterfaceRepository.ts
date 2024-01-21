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

export const DEFAULT_INCOME_MAP = {
  Nómina: { id: 'INCOME-1', concept: 'Nómina' },
  Rentas: { id: 'INCOME-2', concept: 'Rentas' },
  'Becas/Subvenciones': { id: 'INCOME-3', concept: 'Becas/Subvenciones' },
  'Apuestas/Juego': { id: 'INCOME-4', concept: 'Apuestas/Juego' },
};

export const DEFAULT_EXPENSE_MAP = {
  'Hipoteca/Alquiler/Comunidad': {
    id: 'EXPENSE-1',
    concept: 'Hipoteca/Alquiler/Comunidad',
  },
  Alimentacion: { id: 'EXPENSE-2', concept: 'Alimentación' },
  Mascotas: { id: 'EXPENSE-3', concept: 'Mascotas' },
  Combustible: { id: 'EXPENSE-4', concept: 'Combustible' },
  Luz: { id: 'EXPENSE-5', concept: 'Luz' },
  Calefacción: { id: 'EXPENSE-6', concept: 'Calefacción' },
  'Telefonía/Internet': { id: 'EXPENSE-7', concept: 'Telefonía/Internet' },
  Agua: { id: 'EXPENSE-8', concept: 'Agua' },
  Estudios: { id: 'EXPENSE-9', concept: 'Estudios' },
  Ocio: { id: 'EXPENSE-10', concept: 'Ocio' },
  'Tasas/Impuestos/Multas': {
    id: 'EXPENSE-11',
    concept: 'Tasas/Impuestos/Multas',
  },
  Educación: { id: 'EXPENSE-12', concept: 'Educación' },
  Salud: { id: 'EXPENSE-13', concept: 'Salud' },
  Seguros: { id: 'EXPENSE-14', concept: 'Seguros' },
  Vehiculo: { id: 'EXPENSE-15', concept: 'Vehículo' },
  Restaurante: { id: 'EXPENSE-16', concept: 'Restaurante' },
};

export abstract class ConceptInterfaceRepository {
  static DEFAULT_INCOME = Object.values(DEFAULT_INCOME_MAP);

  static DEFAULT_EXPENSE = Object.values(DEFAULT_EXPENSE_MAP);

  abstract addInitialData(email: Email): Promise<void>;
  abstract addExpense(email: Email, concept: string): Promise<Concept>;
  abstract addIncome(email: Email, concept: string): Promise<Concept>;
  abstract readAllExpense(email: Email): Promise<Concept[]>;
  abstract readAllIncome(email: Email): Promise<Concept[]>;
  abstract deleteExpense(email: Email, conceptId: string): Promise<void>;
  abstract deleteIncome(email: Email, conceptId: string): Promise<void>;
}
