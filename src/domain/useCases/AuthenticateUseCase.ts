import { UserInterfaceRepository } from '@application/repository/UserRepository/UserInterfaceRepository';
import JWTService from '@application/services/JWTService';
import { Email } from '@domain/models/Email';
import { Password } from '@domain/models/Password';

export class AuthenticateUseCase {
  constructor(private userRepository: UserInterfaceRepository) {}
  authenticate(emailDTO: string, passwordDTO: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const email = Email.createFromText(emailDTO);
        const passwordHash = Password.createFromHash(passwordDTO);
        const user = await this.userRepository.findByEmail(email);

        const match = passwordHash.isEqual(user.getPassword());

        if (match) {
          const userPayload = { name: user.getFirtname() };
          const jwt = JWTService.createJWT(emailDTO, userPayload);
          //todo crear dto
          resolve(jwt);
        } else {
          //todo crear dto
          console.log('reject');
          reject();
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
