import { AlimentationBatch } from '@infrastructure/modules/FinancialControl/infrastructure/batch/AlimentationBatch/AlimentationBatch';
import cron from 'node-cron';

cron.schedule('0 6 * * *', function () {
  console.log('Running a task every day at 6:00 AM');

  Promise.allSettled([AlimentationBatch()]);
});
