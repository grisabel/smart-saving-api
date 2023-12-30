import {
  OPERATIONSID_REPOSITORY_ERROR,
  OperationsIdInterfaceRepository,
} from '@application/repository/OperationsId/OperationIdInterfaceRepository';
import { OperationsIdLocalRepository } from '@application/repository/OperationsId/OperationsIdLocalRepository';
import { OperationExample } from '@application/repository/OperationsId/test/OperationExample';
import {
  USER_REPOSITORY_ERROR,
  UserInterfaceRepository,
} from '@application/repository/UserRepository/UserInterfaceRepository';
import { UserLocalRepository } from '@application/repository/UserRepository/UserLocalRepository';
import { EmailService } from '@application/services/EmailService/EmailService';
import { Id } from '@domain/models/Id/Id';
import { Password } from '@domain/models/Password';
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
  let operationRepository: OperationsIdInterfaceRepository;

  beforeEach(() => {
    userRepository = new UserLocalRepository();

    resend = new Resend('api key');
    emailService = new EmailService(resend);

    operationRepository = new OperationsIdLocalRepository();

    userUseCase = new UserUseCase(
      userRepository,
      emailService,
      operationRepository
    );
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
      jest.spyOn(operationRepository, 'save');
      const user1 = UserExample.user1_text();
      //act
      await userRepository.save(user1);
      const [, responseDto] = await userUseCase.resetPassword(
        user1.getEmail(),
        user1.getDateBirth()
      );

      //assert
      expect(operationRepository.save).toHaveBeenCalled();
      const operation = (operationRepository.save as any).mock.calls[0][0];
      expect(resend.emails.send).toHaveBeenCalledWith({
        from: 'notify@smartsavings.dev',
        to: user1.getEmail().getValue(),
        subject: 'Hello World',
        html: `<p>OperationId <strong>${operation.id}</strong></p>`,
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
  describe('el método resetPasswordConfirm', () => {
    it('debe confirmar el cambio de contraseña', async () => {
      //arange
      jest.spyOn(operationRepository, 'save');
      const user1 = UserExample.user1_text();
      //act
      await userRepository.save(user1);
      await userUseCase.resetPassword(user1.getEmail(), user1.getDateBirth());
      const operation = (operationRepository.save as any).mock.calls[0][0];

      const [, responseDto] = await userUseCase.resetPasswordConfirm(
        Id.createFrom(operation.id),
        Password.createFromText('Pwd@12345S')
      );
      //assert
      expect(responseDto.status).toEqual(200);
      expect(responseDto.message).toEqual(
        'Contraseña actualizada satisfactoriamente'
      );
    });
    it('debe lanzar una excepcion dado un operationId no existente', async () => {
      //act
      const [errorDto] = await userUseCase.resetPasswordConfirm(
        Id.createId(),
        Password.createFromText('Pwd@12345S')
      );
      //assert
      expect(errorDto.status).toEqual(404);
      expect(errorDto.message).toEqual('OperationId invalido');
    });
    it('debe lanzar una excepcion dado un operationId expirado', async () => {
      //arange
      const operationExpired = OperationExample.operationResetPasswordExpired();

      //act
      await operationRepository.save(operationExpired);

      const [errorDto] = await userUseCase.resetPasswordConfirm(
        Id.createFrom(operationExpired.id),
        Password.createFromText('Pwd@12345S')
      );
      //assert
      expect(errorDto.status).toEqual(410);
      expect(errorDto.message).toEqual('OperationId expirado');
    });
    it('debe lanzar una excepcion dado un operationId asociado a un usario no válido', async () => {
      //arange
      const operationNoUser =
        OperationExample.operationResetPasswordWithoutUser();

      //act
      await operationRepository.save(operationNoUser);

      const [errorDto] = await userUseCase.resetPasswordConfirm(
        Id.createFrom(operationNoUser.id),
        Password.createFromText('Pwd@12345S')
      );
      //assert
      expect(errorDto.status).toEqual(404);
      expect(errorDto.message).toEqual('OperationId invalido');
    });
  });
  describe('el metodo deleteAccountConfirm', () => {
    it('debe eliminar una cuenta dado un operationId válido', async () => {
      // Arange
      const user1 = UserExample.real_user_text();
      const user1Hash = UserExample.real_user_hash();
      const operationDeleteAccount = OperationExample.operationDeleteAccount();
      await userRepository.save(user1);
      await operationRepository.save(operationDeleteAccount);

      const id = Id.createFrom(operationDeleteAccount.id);
      const email = user1.getEmail();
      const pwd = user1Hash.getPassword();
      // Act
      const [errorDto, responseDto] = await userUseCase.deleteAccountConfirm(
        id,
        email,
        pwd
      );

      // Arrange
      expect(responseDto.status).toEqual(200);
      expect(responseDto.message).toEqual('Cuenta eliminada con éxito');

      let throwErrorOp;
      try {
        await operationRepository.find(id);
      } catch (error) {
        throwErrorOp = error;
      }
      expect(throwErrorOp.data).toEqual({
        idNotExist: OPERATIONSID_REPOSITORY_ERROR.idNotExist,
      });

      let throwErrorUser;
      try {
        await userRepository.findByEmail(email);
      } catch (error) {
        throwErrorUser = error;
      }
      expect(throwErrorUser.data).toEqual({
        userNotExist: USER_REPOSITORY_ERROR.userNotExist,
      });
    });
    it('debe lanzar una excepcion si el operationId no es válido', async () => {
      // Arange
      const user1 = UserExample.real_user_text();
      const user1Hash = UserExample.real_user_hash();
      const operationDeleteAccount = OperationExample.operationDeleteAccount();
      await userRepository.save(user1);

      const id = Id.createFrom(operationDeleteAccount.id);
      const email = user1.getEmail();
      const pwd = user1Hash.getPassword();
      // Act
      const [errorDto] = await userUseCase.deleteAccountConfirm(id, email, pwd);

      // Arrange
      expect(errorDto.status).toEqual(404);
      expect(errorDto.message).toEqual('OperationId invalido');
    });
    it('debe lanzar una excepcion si el operationId ha expirado', async () => {
      // Arange
      const user1 = UserExample.real_user_text();
      const user1Hash = UserExample.real_user_hash();
      const operationDeleteAccountExpired =
        OperationExample.operationDeleteAccountExpired();
      await userRepository.save(user1);
      await operationRepository.save(operationDeleteAccountExpired);

      const id = Id.createFrom(operationDeleteAccountExpired.id);
      const email = user1.getEmail();
      const pwd = user1Hash.getPassword();
      // Act
      const [errorDto] = await userUseCase.deleteAccountConfirm(id, email, pwd);

      // Arrange
      expect(errorDto.status).toEqual(410);
      expect(errorDto.message).toEqual('OperationId expirado');
    });
    it('debe lanzar una excepcion si la contraseña no coincide', async () => {
      // Arange
      const user1 = UserExample.real_user_text();
      const operationDeleteAccount = OperationExample.operationDeleteAccount();
      await userRepository.save(user1);
      await operationRepository.save(operationDeleteAccount);

      const id = Id.createFrom(operationDeleteAccount.id);
      const email = user1.getEmail();
      const pwd = Password.createHash('12345@aA');
      // Act
      const [errorDto] = await userUseCase.deleteAccountConfirm(id, email, pwd);

      // Arrange
      expect(errorDto.status).toEqual(403);
      expect(errorDto.message).toEqual('Contraseña incorrecta');
    });
  });
});
// TODO AÑADIR ERROR GENERICO
