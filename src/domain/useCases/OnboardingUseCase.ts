import { UserLocalRepository } from '@application/repository/UserRepository/UserLocalRepository';
import { Email } from '@domain/models/Email';
import { Password } from '@domain/models/Password';
import { User } from '@domain/models/User';
import { PostUserDTO } from '@infrastructure/modules/users/dtos/request/PostUserDTO';

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
        reject();
      }
    });
  }
}
