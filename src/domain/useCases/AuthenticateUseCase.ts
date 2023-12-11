export class AuthenticateUseCase {
  authenticate(emailDTO: string, passwordDTO: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve('');
    });
  }
}
