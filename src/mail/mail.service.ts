import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationCode(
    user: {
      email: string;
      name: string;
    },
    registerToken: string,
  ) {
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Fun Olympics" <support@funolympics.com>',
      subject: 'Verify Your Fun Olympic Account',
      template: 'accountVerification',
      context: {
        name: user.name,
        registerToken,
      },
    });
  }
}
