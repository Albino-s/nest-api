import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthController} from '../auth/auth.controller';
import {LoggerModule} from '../../logging/logger.module';
import {AuthService} from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import {AppMailerModule} from '../../emails/app-mailer.module';
import {TypeOrmConfigService} from '../../database/typeorm.coinfig.service';
import {User} from './entities/user.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([User]),
      LoggerModule,
      AppMailerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
