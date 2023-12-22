import { UserInterfaceRepository } from '../../../src/application/repository/UserRepository/UserInterfaceRepository';
import JWTService from '../../../src/application/services/JWTService';
import { Email } from '../../../src/domain/models/Email';
import { Password } from '../../../src/domain/models/Password';
import { LoginResponseDto } from '../../../src/infrastructure/modules/users/dtos/response/LoginResponseDto';

import {
  LOGIN_ERROR,
  LoginErrorDto,
} from '../../../src/infrastructure/modules/users/dtos/response/LoginErrorDto';

export class AuthenticateUseCase {
  constructor(private userRepository: UserInterfaceRepository) {}
  authenticate(
    emailDto: string,
    passwordDto: string
  ): Promise<[LoginErrorDto | null, LoginResponseDto | null]> {
    return new Promise(async (resolve) => {
      try {
        const email = Email.createFromText(emailDto);
        const passwordHash = Password.createFromHash(passwordDto);
        const user = await this.userRepository.findByEmail(email);

        const match = passwordHash.isEqual(user.getPassword());

        if (match) {
          const userPayload = { name: user.getFirtname() };
          const jwt = JWTService.createJWT(emailDto, userPayload);
          const responseDto = { accessToken: jwt };
          resolve([null, responseDto]);
        } else {
          const errorDto = { message: LOGIN_ERROR.msg };
          resolve([errorDto, null]);
        }
      } catch (error) {
        const errorDto = { message: LOGIN_ERROR.msg };
        resolve([errorDto, null]);
      }
    });
  }
}
