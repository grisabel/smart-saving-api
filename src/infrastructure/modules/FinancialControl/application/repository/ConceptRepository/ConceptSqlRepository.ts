import { prisma } from '@application/repository/db';
import {
  CONCEPT_REPOSITORY_ERROR,
  ConceptInterfaceRepository,
  ConceptRepositoryError,
} from './ConceptInterfaceRepository';
import { Concept } from './models/Concept';
import { ConceptType } from '@prisma/client';
import { Email } from '@domain/models/Email';
import { Id } from '@domain/models/Id/Id';

export class ConceptSqlRepository implements ConceptInterfaceRepository {
  addInitialData(email: Email): Promise<void> {
    return new Promise((resolve, reject) => {
      const defaultIncomes = [
        { id: 'EXPENSE-1', concept: 'Nómina' },
        { id: 'EXPENSE-2', concept: 'Rentas' },
        { id: 'EXPENSE-3', concept: 'Becas/Subvenciones' },
        { id: 'EXPENSE-4', concept: 'Apuestas/Juego' },
      ].map((income) => {
        return {
          userEmail: email.getValue(),
          type: ConceptType.Concept_Income,
          concept: income.concept,
          id: `${income.id}-${Id.createId().getValue()}`,
        };
      });

      const defaultExpenses = [
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
      ].map((expense) => {
        return {
          userEmail: email.getValue(),
          type: ConceptType.Concept_Expense,
          concept: expense.concept,
          id: `${expense.id}-${Id.createId().getValue()}`,
        };
      });

      prisma.concept
        .createMany({
          data: [...defaultIncomes, ...defaultExpenses],
        })
        .then((value) => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  addExpense(email: Email, concept: string): Promise<Concept> {
    return new Promise<Concept>((resolve, reject) => {
      prisma.concept
        .create({
          data: {
            userEmail: email.getValue(),
            type: ConceptType.Concept_Expense,
            concept: concept,
          },
        })
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          if (error.code === 'P2002') {
            const error = new ConceptRepositoryError({
              conceptDuplicate: CONCEPT_REPOSITORY_ERROR.conceptDuplicate,
            });
            reject(error);
            return;
          }
          reject(error);
        });
    });
  }
  addIncome(email: Email, concept: string): Promise<Concept> {
    return new Promise<Concept>((resolve, reject) => {
      prisma.concept
        .create({
          data: {
            userEmail: email.getValue(),
            type: ConceptType.Concept_Income,
            concept: concept,
          },
        })
        .then((value) => resolve(value))
        .catch((error) => {
          if (error.code === 'P2002') {
            const error = new ConceptRepositoryError({
              conceptDuplicate: CONCEPT_REPOSITORY_ERROR.conceptDuplicate,
            });
            reject(error);
            return;
          }
          reject(error);
        });
    });
  }
  readAllExpense(email: Email): Promise<Concept[]> {
    return new Promise((resolve, reject) => {
      prisma.concept
        .findMany({
          where: {
            userEmail: email.getValue(),
            type: ConceptType.Concept_Expense,
          },
        })
        .then((expenses) => {
          const values = expenses.map((expense) => {
            return {
              id: expense.id,
              concept: expense.concept,
            };
          });

          resolve(values);
        })
        .catch(() => reject());
    });
  }
  readAllIncome(email: Email): Promise<Concept[]> {
    return new Promise((resolve, reject) => {
      prisma.concept
        .findMany({
          where: {
            userEmail: email.getValue(),
            type: ConceptType.Concept_Income,
          },
        })
        .then((incomes) => {
          const values = incomes.map((income) => {
            return {
              id: income.id,
              concept: income.concept,
            };
          });

          resolve(values);
        })
        .catch(() => reject());
    });
  }
  deleteExpense(email: Email, conceptId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.concept
        .delete({
          where: {
            userEmail: email.getValue(),
            type: ConceptType.Concept_Expense,
            id: conceptId,
          },
        })
        .then(() => {
          resolve();
        })
        .catch(() => {
          const error = new ConceptRepositoryError({
            conceptIdNotExist: CONCEPT_REPOSITORY_ERROR.conceptIdNotExist,
          });
          reject(error);
        });
    });
  }
  deleteIncome(email: Email, conceptId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.concept
        .delete({
          where: {
            userEmail: email.getValue(),
            type: ConceptType.Concept_Income,
            id: conceptId,
          },
        })
        .then(() => {
          resolve();
        })
        .catch((_error) => {
          //todo
          console.log(_error);
          const error = new ConceptRepositoryError({
            conceptIdNotExist: CONCEPT_REPOSITORY_ERROR.conceptIdNotExist,
          });
          reject(error);
        });
    });
  }
}
