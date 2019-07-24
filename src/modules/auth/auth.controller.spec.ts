import { Test } from '@nestjs/testing';
import { User} from '../users/entities/user.entity';
import {ClassSerializerInterceptor, UseInterceptors} from '@nestjs/common';
import {ConfigModule, ConfigService} from 'nestjs-config';
import {LoggerModule} from '../../logging/logger.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import * as faker from 'faker';
import {FakeEntitiesService} from '../../tests/fake.entities.service';
import * as path from "path";
import {TestDatabaseModule} from '../../database/test-database.module';
import {FakeEntitiesModule} from '../../tests/fake.entities.module';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {VerifyUserMailer} from '../../emails/verify-user.mailer';
import {MailerModule} from '@nest-modules/mailer';
import {UsersModule} from '../users/users.module';
import {AppMailerModule} from '../../emails/app-mailer.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';


describe('AuthController', () => {

    let authController: AuthController;
    let authService: AuthService;
    let fakeEntitiesService: FakeEntitiesService;
    let verifyUserMailer: VerifyUserMailer;

    beforeEach(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000; // this important for Mockoose to work with Jest
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.load(path.resolve(__dirname + '/../../', 'config', '**/!(*.d).{ts,js}')),
                TestDatabaseModule,
                FakeEntitiesModule,
                MailerModule.forRootAsync({
                    useFactory: async (configService: ConfigService) => (configService.get('mailer')),
                    inject: [ConfigService],
                }),
                PassportModule.register({ defaultStrategy: 'jwt' }),
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async (configService: ConfigService) => (configService.get('jwt')),
                    inject: [ConfigService],
                }),
                TypeOrmModule.forFeature([User]),
                LoggerModule,
                UsersModule,
                AppMailerModule,
            ],
            controllers: [AuthController],
            providers: [AuthService],
        })
            .compile();

        authService = module.get<AuthService>(AuthService);
        authController = module.get<AuthController>(AuthController);
        fakeEntitiesService = module.get<FakeEntitiesService>(FakeEntitiesService);
        verifyUserMailer = module.get<VerifyUserMailer>(VerifyUserMailer);
    });

    afterEach(async () => {
        await fakeEntitiesService.flushAllUsers();
        await fakeEntitiesService.connectionClose();
    });

    describe('signup', () => {
        it('should return new user', async () => {
            const userDto = {
                fullName: faker.name.findName(),
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(30),
                passwordConfirmation:'',
            };
            const user = fakeEntitiesService.createUser(userDto);
            jest.spyOn(authService, 'signup').mockImplementation(async () => user);
            const newUser = await authController.signup(userDto);
            expect(newUser).toHaveProperty('verificationCode');
            expect(newUser).toHaveProperty('email', userDto.email);
            expect(newUser).toHaveProperty('fullName', userDto.fullName);
            expect(newUser).toHaveProperty('password');
            expect(newUser).toHaveProperty('isAdmin', false);
            expect(newUser).toHaveProperty('isVerified', false);
        });
    });

    describe('login', () => {
        it('should return logged in user', async () => {
            const password = 'stronger than hell';
            const cryptPass = await bcrypt.hashSync(password, 11);
            const user = await fakeEntitiesService.createUser({isVerified: true, password: cryptPass});
            const loggedInUser = await authController.login({email: user.email, password});
            const serialized = (new ClassSerializerInterceptor([]))
                .serialize(loggedInUser, {});
            expect(serialized).toHaveProperty('verificationCode', undefined);
            expect(serialized).toHaveProperty('password', undefined);
            expect(serialized).toHaveProperty('email', user.email);
            expect(serialized).toHaveProperty('fullName', user.fullName);
            expect(serialized).toHaveProperty('isAdmin', false);
            expect(serialized).toHaveProperty('isVerified', true);
            expect(serialized).toHaveProperty('accessToken');

        });
    });

    describe('verify', () => {
        it('should return logged in user', async () => {
            const user = await fakeEntitiesService.createUser({isVerified: false});
            const loggedInUser = await authController.verify({ code: user.verificationCode});
            const serialized = (new ClassSerializerInterceptor([]))
                .serialize(loggedInUser, {});
            expect(serialized).toHaveProperty('verificationCode', undefined);
            expect(serialized).toHaveProperty('password', undefined);
            expect(serialized).toHaveProperty('email', user.email);
            expect(serialized).toHaveProperty('fullName', user.fullName);
            expect(serialized).toHaveProperty('isAdmin', false);
            expect(serialized).toHaveProperty('isVerified', true);
            expect(serialized).toHaveProperty('accessToken');

        });
    });

});
