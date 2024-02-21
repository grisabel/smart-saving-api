import { HabitInterfaceRepository } from './HabitInterfaceRepository';
import { HabitSqlRepository } from './HabitSqlRepository';

export class HabitFactoryRepository {
  static instance: HabitInterfaceRepository | null = null;

  static getInstance(): HabitInterfaceRepository {
    if (!HabitFactoryRepository.instance) {
      const userRepository = new HabitSqlRepository();
      HabitFactoryRepository.instance = userRepository;
    }
    return HabitFactoryRepository.instance;
  }
}
