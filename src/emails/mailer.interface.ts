import { SentMessageInfo } from 'nodemailer';

export interface MailerInterface {

    send(data): Promise<SentMessageInfo>;
}
