import { UserLocalRepository } from '../../application/repository/UserRepository/UserLocalRepository';
import { Email } from '../models/Email';
import { Password } from '../models/Password';
import { User } from '../models/User';
import { PostUserDTO } from '../../infrastructure/modules/users/dtos/request/PostUserDTO';
import { EmailError } from '../models/Email/EmailError';
import { PasswordError } from '../models/Password/PasswordError';
import { DomainErrorResponseMapper } from '../../infrastructure/mappers/response/DomainErrorResponseMapper';
import { ErrorResponseDto } from '../../infrastructure/dtos/response/ErrorResponseDto';

const userRepository = new UserLocalRepository();
export class OnboardingUseCase {
  saveUser(userDTO: PostUserDTO): Promise<[ErrorResponseDto]> {
    return new Promise((resolve) => {
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
        resolve([null]);
      } catch (error) {
        if (error instanceof EmailError) {
          const errorDto = DomainErrorResponseMapper.toResponse(
            error,
            'Error al validar el email'
          );
          resolve([errorDto]);
        } else if (error instanceof PasswordError) {
          const errorDto = DomainErrorResponseMapper.toResponse(
            error,
            'Error al validar la contraseña'
          );
          resolve([errorDto]);
        }

        resolve([error]);
      }
    });
  }
}
