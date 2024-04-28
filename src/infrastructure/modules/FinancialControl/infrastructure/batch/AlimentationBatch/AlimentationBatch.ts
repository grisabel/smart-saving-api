import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';
import { DateTimeModel } from '@application/services/DateTimeService/DateTimeInterfaceService';
import DateTimeService from '@application/services/DateTimeService/DateTimeService';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';
import { DEFAULT_EXPENSE_MAP } from '@infrastructure/modules/FinancialControl/application/repository/ConceptRepository/ConceptInterfaceRepository';
import { HabitFactoryRepository } from '@infrastructure/modules/FinancialControl/application/repository/HabitsRepository/HabitFactoryRepository';
import { HabitsType } from '@infrastructure/modules/FinancialControl/application/repository/HabitsRepository/models/Habit';
import { TransactionFactoryRepository } from '@infrastructure/modules/FinancialControl/application/repository/TransactionRepository/TransactionFactoryRepository';

const userRepository = UserFactoryRepository.getInstance();
const transactionRepository = TransactionFactoryRepository.getInstance();
const habitRepository = HabitFactoryRepository.getInstance();

export const AlimentationBatch = async () => {
  // para todos los usuario
  // buscar los gastos de tipo alimentacón del mes actual
  // y quedarse con el más contoso
  try {
    const users = await userRepository.findAll();

    try {
      for (const user of users) {
        await habitRepository.delete(
          user.getEmail(),
          HabitsType.Habits_Alimentation
        );
        const accountNumber = 0;

        const _year = new Date().getFullYear();

        const dateStart: DateTimeModel = {
          date: `${_year}-01-01`,
          format: 'yyyy-MM-dd',
        };

        const { dateStart: _dateStart } = DateTimeService.getMonthLimits(
          {
            date: new Date().getTime().toString(),
            format: DATE_FORMATS.TimestampMs,
          },
          'month'
        );

        const dateEnd = DateTimeService.calculatePastDate(_dateStart, {
          unit: 'days',
          amount: 1,
        });

        const expenses = await transactionRepository.getExpenses(
          user.getEmail(),
          accountNumber,
          DEFAULT_EXPENSE_MAP.Alimentacion.id,
          dateEnd,
          dateStart
        );

        for (const expense of expenses) {
          try {
            await habitRepository.create({
              email: user.getEmail().getValue(),
              transactionId: expense.transactionId ?? '',
              type: HabitsType.Habits_Alimentation,
            });
          } catch (error) {
            console.log('error in save');
          }
        }
      }
    } catch (error) {
      console.log('error in user');
    }

    console.log('Done AlimentationBatch');
  } catch (error) {
    console.log('Error AlimentationBatch');
  }
};
