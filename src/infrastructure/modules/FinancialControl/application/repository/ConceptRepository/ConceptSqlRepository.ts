import { prisma } from '@application/repository/db';
import {
  CONCEPT_REPOSITORY_ERROR,
  ConceptInterfaceRepository,
  ConceptRepositoryError,
} from './ConceptInterfaceRepository';
import { Concept } from './models/Concept';
import { ConceptType } from '@prisma/client';
import { Email } from '@domain/models/Email';

export class ConceptSqlRepository implements ConceptInterfaceRepository {
  addExpense(email: Email, concept: string): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.concept
        .create({
          data: {
            userEmail: email.getValue(),
            type: ConceptType.Concept_Expense,
            concept: concept,
          },
        })
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }
  addIncome(email: Email, concept: string): Promise<void> {
    return new Promise((resolve, reject) => {
      prisma.concept
        .create({
          data: {
            userEmail: email.getValue(),
            type: ConceptType.Concept_Income,
            concept: concept,
          },
        })
        .then(() => resolve())
        .catch((error) => reject(error));
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
        .catch(() => {
          //todo
          const error = new ConceptRepositoryError({
            conceptIdNotExist: CONCEPT_REPOSITORY_ERROR.conceptIdNotExist,
          });
          reject(error);
        });
    });
  }
}
