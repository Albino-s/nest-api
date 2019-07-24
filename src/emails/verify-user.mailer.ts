import {Inject, Injectable} from '@nestjs/common';
import {MailerService} from '@nest-modules/mailer';
import {User} from '../modules/users/entities/user.entity';
import { ConfigService } from 'nestjs-config';
import { SentMessageInfo } from 'nodemailer';
import {MailerInterface} from './mailer.interface';

@Injectable()
export class VerifyUserMailer implements MailerInterface {
    constructor(
        private readonly mailerService: MailerService,
        private readonly config: ConfigService,
    ) {
    }

    async send(createdUser: User): Promise<SentMessageInfo> {
        return this
            .mailerService
            .sendMail({
                to: createdUser.email, // sender address
                subject: `Confirm ${createdUser.email} on OptionHouse`, // Subject line
                template: 'verify_user',
                context: {
                    name: createdUser.fullName,
                    email: createdUser.email,
                    link: [
                        this.config.get('app.frontendURL'),
                        this.config.get('app.frontendVerificationPath'),
                        createdUser.verificationCode,
                    ].join('/'),
                },
            });
    }
}
