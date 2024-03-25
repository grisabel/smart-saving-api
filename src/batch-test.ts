import { AlimentationBatch } from '@infrastructure/modules/FinancialControl/infrastructure/batch/AlimentationBatch/AlimentationBatch';
import { AntExpenseBatch } from '@infrastructure/modules/FinancialControl/infrastructure/batch/AntExpenseBatch/AntExpenseBatch';
import { RestaurantBatch } from '@infrastructure/modules/FinancialControl/infrastructure/batch/RestaurantBatch/RestaurantBatch';
import { VehicleBatch } from '@infrastructure/modules/FinancialControl/infrastructure/batch/VehicleBatch/VehicleBatch';

AlimentationBatch();
VehicleBatch();
RestaurantBatch();
AntExpenseBatch();
