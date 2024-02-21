import { AlimentationBatch } from '@infrastructure/modules/FinancialControl/infrastructure/batch/AlimentationBatch/AlimentationBatch';
import { AntExpenseBatch } from '@infrastructure/modules/FinancialControl/infrastructure/batch/AntExpenseBatch/AntExpenseBatch';
import { RestaurantBatch } from '@infrastructure/modules/FinancialControl/infrastructure/batch/RestaurantBatch/RestaurantBatch';
import { VehicleBatch } from '@infrastructure/modules/FinancialControl/infrastructure/batch/VehicleBatch/VehicleBatch';
import cron from 'node-cron';

cron.schedule('0 6 * * *', function () {
  console.log('Running a task every day at 6:00 AM');

  Promise.allSettled([
    AlimentationBatch(),
    VehicleBatch(),
    RestaurantBatch(),
    AntExpenseBatch(),
  ]);
});
