import cron from 'node-cron';

cron.schedule('0 6 * * *', function () {
  console.log('Running a task every day at 6:00 AM');
  // Your task code goes here
});
