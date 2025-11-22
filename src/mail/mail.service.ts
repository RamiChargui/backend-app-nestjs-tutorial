import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, RequestTimeoutException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailservice: MailerService) {}

  /**
   * send email verification
   * @param email 
   * @param link 
   */
   public async sendVerificatinEmail(email: string, link: string): Promise<void> {
    try {
      await this.mailservice.sendMail({
        to: email,
        from: `<no-reply@startdev.com>`,
        subject: 'Verify your account!',
        template: 'verify-email',
        context: {link},
      });
    } catch (err) {
      console.log('Error sending email', err);
      throw new RequestTimeoutException('Error sending welcome email');
    }
  }

  public async sendWelcomeEmail(
    email: string,
    username: string,
  ): Promise<void> {
    try {
      const today = new Date();
      await this.mailservice.sendMail({
        to: email,
        from: `<no-reply@startdev.com>`,
        subject: 'Welcome to StartDev!',
        template: 'register',
        context: {
          username,
          today,
        },
      });
    } catch (err) {
      console.log('Error sending email', err);
      throw new RequestTimeoutException('Error sending welcome email');
    }
  }
}
