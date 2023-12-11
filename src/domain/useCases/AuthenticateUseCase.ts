import JWTService from '@application/services/JWTService';
export class AuthenticateUseCase {
  authenticate(emailDTO: string, passwordDTO: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const user = { name: 'Name' };
      const jwt = JWTService.createJWT(emailDTO, user);
      resolve(jwt);
    });
  }
}
