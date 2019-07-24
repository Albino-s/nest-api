import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';
import {UsersModule} from './modules/users/users.module';
import {AuthModule} from './modules/auth/auth.module';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import {LoggerModule} from './logging/logger.module';
import {AuthService} from './modules/auth/auth.service';
import {LoggerService} from 'nest-logger';
import {AppMailerModule} from './emails/app-mailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {DatabaseModule} from './database/database.module';
import {TypeOrmConfigService} from './database/typeorm.coinfig.service';


@Module({
  imports: [
      LoggerModule,
      ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
      TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService,
      }),
      UsersModule,
      AuthModule,
      MailerModule.forRootAsync({
          useFactory: async (configService: ConfigService) => (configService.get('mailer')),
          inject: [ConfigService],
      }),
      AppMailerModule,

  ],
    providers: [LoggerService],
})
export class ApplicationModule {}
