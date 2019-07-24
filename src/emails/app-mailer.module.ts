import {Module} from '@nestjs/common';
import {LoggerModule} from '../logging/logger.module';
import {VerifyUserMailer} from './verify-user.mailer';


@Module({
    imports: [
        LoggerModule,
    ],
    providers: [VerifyUserMailer],
    exports: [VerifyUserMailer],
})
export class AppMailerModule {}
