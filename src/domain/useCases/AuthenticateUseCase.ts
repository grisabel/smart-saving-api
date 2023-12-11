import { UserInterfaceRepository } from '@application/repository/UserRepository/UserInterfaceRepository';
import JWTService from '@application/services/JWTService';
import { Email } from '@domain/models/Email';
import { Password } from '@domain/models/Password';
import { LoginResponseDto } from '@infrastructure/modules/users/dtos/response/LoginResponseDto';
import { ErrorResponseDto } from '../../infrastructure/dtos/response/ErrorResponseDto';
export class AuthenticateUseCase {
  constructor(private userRepository: UserInterfaceRepository) {}
  authenticate(
    emailDTO: string,
    passwordDTO: string
  ): Promise<[ErrorResponseDto | null, LoginResponseDto | null]> {
    return new Promise(async (resolve) => {
      try {
        const email = Email.createFromText(emailDTO);
        const passwordHash = Password.createFromHash(passwordDTO);
        const user = await this.userRepository.findByEmail(email);

        const match = passwordHash.isEqual(user.getPassword());

        if (match) {
          const userPayload = { name: user.getFirtname() };
          const jwt = JWTService.createJWT(emailDTO, userPayload);
          const responseDTO = { accessToken: jwt };
          resolve([null, responseDTO]);
        } else {
          //todo crear dto
          console.log('reject');
          resolve([null, null]);
        }
      } catch (error) {
        console.log('error');
        //todo añadir dto excepción email
        //todo añadir dto excepción contraseña
        //todo añadir dto excepcion usuario no encontrado
      }
    });
  }
}
