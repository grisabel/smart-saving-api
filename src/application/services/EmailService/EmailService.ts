import { Operation } from '@application/repository/OperationsId/models/OperationId';
import { Email } from '@domain/models/Email';
import config from '@infrastructure/config';
import { Resend } from 'resend';

//TODO review texts
export const EMAIL_SERVICE_ERROR = {
  emailSendError: 'Error al enviar el email',
};
export interface EmailServiceErrorParams {
  emailSendError?: string;
}

export class EmailServiceError extends Error {
  static msg: string = 'EmailServiceError';
  public data: EmailServiceErrorParams;

  constructor(data: EmailServiceErrorParams) {
    super(EmailServiceError.msg);
    this.data = data;
  }
}

export class EmailService {
  constructor(private resend: Resend) {}

  send(email: Email, operation: Operation): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const { error } = await this.resend.emails.send({
          from: 'notify@smartsavings.dev',
          to: email.getValue(),
          subject: 'Hello World',
          html: `<p>Url para cambiar contraseña ${config.EMAIL.URL_BASE}/reset-password?operationId=${operation.id}</p>`,
        });

        if (error) {
          const domainError = new EmailServiceError({
            emailSendError: EMAIL_SERVICE_ERROR.emailSendError,
          });
          reject(domainError);
          return;
        }

        resolve();
        return;
      } catch (error) {
        reject(error);
      }
    });
  }
}

export class EmailServiceFactory {
  static instance: EmailService | null = null;

  static getInstance(): EmailService {
    if (!EmailServiceFactory.instance) {
      const resend = new Resend(config.EMAIL.API_KEY);
      EmailServiceFactory.instance = new EmailService(resend);
    }
    return EmailServiceFactory.instance;
  }
}
