import { Email } from '@domain/models/Email';
import { Id } from '@domain/models/Id/Id';
import { ConceptInterfaceRepository } from '@infrastructure/modules/FinancialControl/application/repository/ConceptRepository/ConceptInterfaceRepository';
import { CustomValidator, ValidationChain } from 'express-validator';

export const concept = (): CustomValidator => {
  return (value) => {
    if (
      ConceptInterfaceRepository.DEFAULT_EXPENSE.map(
        (expense) => expense.id
      ).includes(value)
    ) {
      return true;
    }
    if (
      ConceptInterfaceRepository.DEFAULT_INCOME.map(
        (income) => income.id
      ).includes(value)
    ) {
      return true;
    }
    try {
      Id.createFrom(value);
      return true;
    } catch (error) {
      throw new Error(error.data.format);
    }
  };
};
