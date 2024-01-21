import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';
import { FinancialAccountFactoryRepository } from '@infrastructure/modules/FinancialControl/application/repository/FinancialAccountRepository/FinancialAccountFactoryRepository';
import { ConceptFactoryRepository } from '@infrastructure/modules/FinancialControl/application/repository/ConceptRepository/ConceptFactoryRepository';
import { UserExample } from '@domain/models/User/test/User.example';
import { TransactionFactoryRepository } from '@infrastructure/modules/FinancialControl/application/repository/TransactionRepository/TransactionFactoryRepository';
import { ConceptInterfaceRepository } from '@infrastructure/modules/FinancialControl/application/repository/ConceptRepository/ConceptInterfaceRepository';
import { AlimentationBatch } from '@infrastructure/modules/FinancialControl/infrastructure/batch/AlimentationBatch/AlimentationBatch';
import { VehicleBatch } from '@infrastructure/modules/FinancialControl/infrastructure/batch/VehicleBatch/VehicleBatch';
import { RestaurantBatch } from '@infrastructure/modules/FinancialControl/infrastructure/batch/RestaurantBatch/RestaurantBatch';
import { AntExpenseBatch } from '@infrastructure/modules/FinancialControl/infrastructure/batch/AntExpenseBatch/AntExpenseBatch';

const userRepository = UserFactoryRepository.getInstance();
const financialAccountRepository =
  FinancialAccountFactoryRepository.getInstance();
const conceptRepository = ConceptFactoryRepository.getInstance();
const transaction = TransactionFactoryRepository.getInstance();

async function main() {
  const user = UserExample.real_user_text();

  await userRepository.save(user);
  await financialAccountRepository.create(user.getEmail());
  await conceptRepository.addInitialData(user.getEmail());

  const accountNumber = 0;

  const income_concepts = ConceptInterfaceRepository.DEFAULT_INCOME.map(
    (c) => c.id
  );
  const expense_concepts = ConceptInterfaceRepository.DEFAULT_EXPENSE.map(
    (c) => c.id
  );

  const dates = [
    '01/01/2024',
    '01/02/2024',
    '01/03/2024',
    '01/04/2024',
    '01/05/2024',
    '01/06/2024',
    '01/07/2024',
    '01/08/2024',
    '01/09/2024',
    '01/10/2024',
    '01/11/2024',
    '01/12/2024',
  ];

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    for (let j = 0; j < income_concepts.length; j++) {
      const concept = income_concepts[j];
      for (let k = 0; k < 2; k++) {
        const index = k;

        var numeroAleatorio = Math.random() * 100;
        const amount = Math.round(numeroAleatorio * 100) / 100;

        await transaction.addIncome(user.getEmail(), accountNumber, {
          amount: amount,
          conceptId: concept,
          date: date,
          note: `nota ${index}`,
        });
      }
    }
    for (let j = 0; j < expense_concepts.length; j++) {
      const concept = expense_concepts[j];
      for (let k = 0; k < 2; k++) {
        const index = k;

        var numeroAleatorio = Math.random() * 100;
        const amount = Math.round(numeroAleatorio * 100) / 100;

        await transaction.addExpense(user.getEmail(), accountNumber, {
          amount: amount,
          conceptId: concept,
          date: date,
          note: `nota ${index}`,
        });
      }
    }
  }
}

async function batch() {
  AlimentationBatch();
  VehicleBatch();
  RestaurantBatch();
  AntExpenseBatch();
}

main()
  .then(() => {
    console.log('Done insert initial data');
    batch()
      .then(() => console.log('Done batch'))
      .catch(() => console.log('Error batch'));
  })
  .catch(() => console.log('Error insert initial data'));
