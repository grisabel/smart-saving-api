import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';
import { DateTimeModel } from '@application/services/DateTimeService/DateTimeInterfaceService';
import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import { DEFAULT_EXPENSE_MAP } from '@infrastructure/modules/FinancialControl/application/repository/ConceptRepository/ConceptInterfaceRepository';
import { FinancialAccountFactoryRepository } from '@infrastructure/modules/FinancialControl/application/repository/FinancialAccountRepository/FinancialAccountFactoryRepository';
import { HabitFactoryRepository } from '@infrastructure/modules/FinancialControl/application/repository/HabitsRepository/HabitFactoryRepository';
import { HabitsType } from '@infrastructure/modules/FinancialControl/application/repository/HabitsRepository/models/Habit';

const userRepository = UserFactoryRepository.getInstance();
const habitRepository = HabitFactoryRepository.getInstance();
const financialAccountRepository =
  FinancialAccountFactoryRepository.getInstance();

export const AntExpenseBatch = async () => {
  // para todos los usuario
  // buscar los gastos de tipo alimentacón del mes actual
  // y quedarse con el más contoso
  try {
    const users = await userRepository.findAll();

    for (const user of users) {
      await habitRepository.delete(
        user.getEmail(),
        HabitsType.Habits_AntExpenses
      );
      const accountNumber = 0;
      const { dateStart, dateEnd } = DateTimeService.getMonthLimits(
        {
          date: new Date().getTime().toString(),
          format: DATE_FORMATS.TimestampMs,
        },
        'month'
      );

      const expenses = await financialAccountRepository.reportsExpense(
        user.getEmail(),
        accountNumber,
        dateEnd,
        dateStart
      );

      const expensesFilter = expenses.filter((expense) => expense.amount < 3);

      for (const expense of expensesFilter) {
        try {
          await habitRepository.create({
            email: user.getEmail().getValue(),
            transactionId: expense.transactionId ?? '',
            type: HabitsType.Habits_AntExpenses,
          });
        } catch (error) {
          console.log('error in save');
        }
      }
    }

    console.log('Done AntExpenseBatch');
  } catch (error) {
    console.log('Error AntExpenseBatch');
  }
};
