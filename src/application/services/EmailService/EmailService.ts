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

const resend = new Resend(config.EMAIL.API_KEY);

const send = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'cheleprueba97@gmail.com',
        subject: 'Hello World',
        html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
      });
      resolve();
    } catch (error) {
      const domainError = new EmailServiceError({
        emailSendError: EMAIL_SERVICE_ERROR.emailSendError,
      });

      reject(domainError);
    }
  });
};

export default {
  send,
};
