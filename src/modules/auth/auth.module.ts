import {Inject, Module} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import {LoggerModule} from '../../logging/logger.module';
import {AuthController} from './auth.controller';
import {UsersService} from '../users/users.service';
import { ConfigService, ConfigModule } from 'nestjs-config';
import * as path from "path";
import {AppMailerModule} from '../../emails/app-mailer.module';
import { JwtService } from '@nestjs/jwt';
import {TypeOrmConfigService} from '../../database/typeorm.coinfig.service';
import {User} from '../users/entities/user.entity';
import {DatabaseModule} from '../../database/database.module';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
                imports: [ConfigModule.load(path.resolve(`${__dirname}/../`, 'config', '**/!(*.d).{ts,js}'))],
                useFactory: async (configService: ConfigService) => (configService.get('jwt')),
                inject: [ConfigService],
            }),
        TypeOrmModule.forFeature([User]),
        LoggerModule,
        UsersModule,
        AppMailerModule,
    ],
    providers: [AuthService, JwtStrategy, UsersService],
    exports: [PassportModule, AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
