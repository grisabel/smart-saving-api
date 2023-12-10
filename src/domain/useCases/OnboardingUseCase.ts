import { UserLocalRepository } from '../../application/repository/UserRepository/UserLocalRepository';
import { Email } from '../models/Email';
import { Password } from '../models/Password';
import { User } from '../models/User';
import { PostUserDTO } from '../../infrastructure/modules/users/dtos/request/PostUserDTO';
import { EmailError } from '../models/Email/EmailError';
import { PasswordError } from '../models/Password/PasswordError';
import { DomainErrorResponseMapper } from '../../infrastructure/mappers/response/DomainErrorResponseMapper';

const userRepository = new UserLocalRepository();
export class OnboardingUseCase {
  saveUser(userDTO: PostUserDTO): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const email = Email.createFromText(userDTO.email);
        const password = Password.createFromText(userDTO.password);
        const user = new User(
          email,
          userDTO.firstName,
          userDTO.lastName,
          userDTO.dateBirth,
          userDTO.objetive,
          userDTO.lastName,
          password
        );
        userRepository.save(user);
        resolve();
      } catch (error) {
        if (error instanceof EmailError) {
          const dto = DomainErrorResponseMapper.toResponse(
            error,
            'Error al validar el email'
          );
          reject(dto);
        } else if (error instanceof PasswordError) {
          const dto = DomainErrorResponseMapper.toResponse(
            error,
            'Error al validar la contraseña'
          );
          reject(dto);
        }

        reject(error);
      }
    });
  }
}
