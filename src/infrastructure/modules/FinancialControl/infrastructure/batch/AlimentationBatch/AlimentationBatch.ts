import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';
import { DateTimeModel } from '@application/services/DateTimeService/DateTimeInterfaceService';
import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import { DEFAULT_EXPENSE_MAP } from '@infrastructure/modules/FinancialControl/application/repository/ConceptRepository/ConceptInterfaceRepository';
import { TransactionFactoryRepository } from '@infrastructure/modules/FinancialControl/application/repository/TransactionRepository/TransactionFactoryRepository';

const userRepository = UserFactoryRepository.getInstance();
const transactionRepository = TransactionFactoryRepository.getInstance();

export const AlimentationBatch = async () => {
  // para todos los usuario
  // buscar los gastos de tipo alimentacón del mes actual
  // y quedarse con el más contoso
  try {
    const users = await userRepository.findAll();

    for (const user of users) {
      const accountNumber = 0;
      const { dateStart, dateEnd } = DateTimeService.getMonthLimits(
        {
          date: new Date().getTime().toString(),
          format: DATE_FORMATS.TimestampMs,
        },
        'month'
      );

      console.log({ dateStart, dateEnd });

      const expenses = await transactionRepository.getExpenses(
        user.getEmail(),
        accountNumber,
        DEFAULT_EXPENSE_MAP.Alimentacion.id,
        dateEnd,
        dateStart
      );

      const expensesSorted = expenses.sort(
        (expense1, expense2) => expense1.amount - expense2.amount
      );

      console.log({
        expenses,
        expensesSorted,
      });

      if (expensesSorted.length > 0) {
        const expenseMax = expensesSorted[0];
        console.log({ expenseMax });
      }
    }

    console.log('Done AlimentationBatch');
  } catch (error) {
    console.log('Error AlimentationBatch');
  }
};
