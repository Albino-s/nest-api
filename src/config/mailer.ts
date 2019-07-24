import {HandlebarsAdapter, PugAdapter} from '@nest-modules/mailer';

export default {
    transport: {
        host: process.env.EMAIL_SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.EMAIL_SMTP_PORT || 587,
        auth: {
            user: process.env.EMAIL_SMTP_USER || 'mireille.cummerata@ethereal.email',
            pass: process.env.EMAIL_SMTP_PASSWORD || 'uUk571JpGwhWW1fJHF',
        },
    },
    defaults: {
        from: `"OptionHouse" ${process.env.EMAIL_FROM}`,
    },
    template: {
        dir: __dirname + '/../emails/templates',
        adapter: new PugAdapter(), // or new HandlebarsAdapter()
        options: {
            strict: true,
        },
    },
};
