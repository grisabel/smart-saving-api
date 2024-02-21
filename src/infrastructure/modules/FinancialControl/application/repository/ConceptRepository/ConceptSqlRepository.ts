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
      const defaultIncomes = ConceptInterfaceRepository.DEFAULT_INCOME.map(
        (income) => {
          return {
            userEmail: email.getValue(),
            type: ConceptType.Concept_Income,
            concept: income.concept,
            id: `${income.id}_${email.getValue()}`,
          };
        }
      );

      const defaultExpenses = ConceptInterfaceRepository.DEFAULT_EXPENSE.map(
        (expense) => {
          return {
            userEmail: email.getValue(),
            type: ConceptType.Concept_Expense,
            concept: expense.concept,
            id: `${expense.id}_${email.getValue()}`,
          };
        }
      );

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
            let conceptId = '';
            try {
              Id.createFrom(expense.id);
              conceptId = expense.id;
            } catch (error) {
              conceptId = expense.id.split('_')[0];
            }
            return {
              id: conceptId,
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
            let conceptId = '';
            try {
              Id.createFrom(income.id);
              conceptId = income.id;
            } catch (error) {
              conceptId = income.id.split('_')[0];
            }
            return {
              id: conceptId,
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
