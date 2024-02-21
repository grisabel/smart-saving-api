import { FinancialAccountInterfaceRepository } from "./FinancialAccountInterfaceRepository";
import { FinancialAccountSqlRepository } from "./FinancialAccountSqlRepository";

export class FinancialAccountFactoryRepository {
  static instance: FinancialAccountInterfaceRepository | null = null;

  static getInstance(): FinancialAccountInterfaceRepository {
    if (!FinancialAccountFactoryRepository.instance) {
        const userRepository = new FinancialAccountSqlRepository();
        FinancialAccountFactoryRepository.instance = userRepository;
    }
    return FinancialAccountFactoryRepository.instance;
  }
}
