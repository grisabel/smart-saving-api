import { UserFactoryRepository } from '@application/repository/UserRepository/UserFactoryRepository';

const userRepository = UserFactoryRepository.getInstance();

export const AlimentationBatch = async () => {
  // para todos los usuario
  // buscar los gastos de tipo alimentacón del mes actual
  // y quedarse con el más contoso
  try {
    const users = await userRepository.findAll();
    console.log('Done AlimentationBatch');
  } catch (error) {
    console.log('Error AlimentationBatch');
  }
};
