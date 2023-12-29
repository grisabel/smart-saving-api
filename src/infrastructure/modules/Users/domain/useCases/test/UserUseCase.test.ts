import { UserInterfaceRepository } from '@application/repository/UserRepository/UserInterfaceRepository';
import { UserLocalRepository } from '@application/repository/UserRepository/UserLocalRepository';
import { EmailService } from '@application/services/EmailService/EmailService';
import { UserExample } from '@domain/models/User/test/User.example';
import { UserUseCase } from '@Users/domain/useCases/UserUseCase';

jest.mock('resend', () => {
  class MockEmails {
    send = (...args) => {
      return {
        error: null,
        data: {},
      };
    };
  }
  class Resend {
    constructor(private apiKey) {}

    emails = new MockEmails();
  }

  return {
    Resend,
  };
});
import { Resend } from 'resend';

describe('La clase UserUseCase', () => {
  let userRepository: UserInterfaceRepository;
  let userUseCase: UserUseCase;
  let resend: Resend;
  let emailService: EmailService;

  beforeEach(() => {
    userRepository = new UserLocalRepository();
    resend = new Resend('api key');

    emailService = new EmailService(resend);
    userUseCase = new UserUseCase(userRepository, emailService);
  });
  describe('el método obtainUser', () => {
    it('debe devolver un UserInfoResponseDto dado un usuario registrado', async () => {
      // Arange
      const user1 = UserExample.user1_text();
      await userRepository.save(user1);

      // Act
      const [, userInfo] = await userUseCase.obtainUserInfo(
        user1.getEmail().getValue()
      );

      // Arrange
      expect(userInfo.firstName).toEqual(user1.getFirtname());
      expect(userInfo.lastName).toEqual(user1.getLastname());
      expect(userInfo.dateBirth).toEqual(user1.getDateBirth());
      expect(userInfo.objective).toEqual(user1.getObjective());
      expect(userInfo.email).toEqual(user1.getEmail().getValue());
    });
    it('debe lanzar un error dado un email invalido', async () => {
      // Arange
      const emailDto = 'aa@a.com';

      // Act
      const [errorDto] = await userUseCase.obtainUserInfo(emailDto);

      // Arrange
      expect(errorDto.message).toEqual('Usuario no encontrado'); // todo
    });
    it('debe lanzar un error dado un usuario no registrado', async () => {
      // Arange
      const user1 = UserExample.user1_text();

      // Act
      const [errorDto] = await userUseCase.obtainUserInfo(
        user1.getEmail().getValue()
      );

      // Arrange
      expect(errorDto.message).toEqual('Usuario no encontrado'); // todo
    });
  });
  describe('el metodo resetPassword', () => {
    it('debe devolver un message de correo enviado si los datos son válidos (email y dateBirth)', async () => {
      //arange
      jest.spyOn(resend.emails, 'send');
      const user1 = UserExample.user1_text();
      //act
      await userRepository.save(user1);
      const [, responseDto] = await userUseCase.resetPassword(
        user1.getEmail(),
        user1.getDateBirth()
      );

      //assert
      expect(resend.emails.send).toHaveBeenCalledWith({
        from: 'notify@smartsavings.dev',
        to: user1.getEmail().getValue(),
        subject: 'Hello World',
        html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
      });
      expect(responseDto.message).toEqual(
        'Si el usuario existe se habrá enviado un email para cambiar la contraseña'
      );
    });
    it('debe lanzar un error dado un email no registrado aunque el mesaje no dará información adicional', async () => {
      // Arange
      const user1 = UserExample.user1_text();
      // Act
      const [errorDto] = await userUseCase.resetPassword(
        user1.getEmail(),
        user1.getDateBirth()
      );

      // Arrange
      expect(errorDto.message).toEqual(
        'Si el usuario existe se habrá enviado un email para cambiar la contraseña'
      ); // todo
    });
    it('debe lanzar un error dado una dateBirth inválido aunque el mesaje no dará información adicional', async () => {
      // Arange
      const user1 = UserExample.user1_text();
      //act
      await userRepository.save(user1);
      const [, responseDto] = await userUseCase.resetPassword(
        user1.getEmail(),
        '29/12/2023'
      );

      // Arrange
      expect(responseDto.message).toEqual(
        'Si el usuario existe se habrá enviado un email para cambiar la contraseña'
      ); // todo
    });
  });
});
// TODO AÑADIR ERROR GENERICO
