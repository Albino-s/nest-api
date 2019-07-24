import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import {Test} from '@nestjs/testing';
import {TestDatabaseModule} from '../../database/test-database.module';
import * as path from "path";
import {ConfigModule, ConfigService} from 'nestjs-config';
import {LoggerModule} from '../../logging/logger.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '../users/entities/user.entity';
import {FakeEntitiesModule} from '../../tests/fake.entities.module';
import {entitiesCreateMethods, FakeEntitiesService} from '../../tests/fake.entities.service';
import * as faker from "faker";
import {AppMailerModule} from '../../emails/app-mailer.module';
import {AuthController} from './auth.controller';
import {MailerModule, MailerService} from '@nest-modules/mailer';
import {VerifyUserMailer} from '../../emails/verify-user.mailer';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {

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

    describe('findByEmail', () => {
        it('should return user', async () => {
            const users = await fakeEntitiesService.createMany(User, 5);
            const selectedUser = users[3];
            const foundUser = await authService.findByEmail(selectedUser.email);
            expect(foundUser.email).toBe(selectedUser.email);
        });
    });


    describe('findByEmail', () => {
        it('should return user', async () => {
            const users = await fakeEntitiesService.createMany(User, 5);
            const selectedUser = users[3];
            const foundUser = await authService.findByEmail(selectedUser.email);
            expect(foundUser.email).toBe(selectedUser.email);
        });
    });

    describe('findById', () => {
        it('should return user', async () => {
            const users = await fakeEntitiesService.createMany(User, 5);
            const selectedUser = users[3];
            const foundUser = await authService.findById(selectedUser.id);
            expect(foundUser.id).toBe(selectedUser.id);
        });
    });

    describe('findByCode', () => {
        it('should return user', async () => {
            const users = await fakeEntitiesService.createMany(User, 5);
            const selectedUser = users[3];
            const foundUser = await authService.findByCode(selectedUser.verificationCode);
            expect(foundUser.verificationCode).toBe(selectedUser.verificationCode);
        });
    });


    describe('signup', () => {
        it('should return new user', async () => {
            jest.spyOn(verifyUserMailer, 'send').mockImplementation(async () => ({success: true}));
            const userDto = {
                fullName: faker.name.findName(),
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(30),
                passwordConfirmation:'',
            };
            const newUser = await authService.signup(userDto);
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
            const loggedInUser = await authService.login({email: user.email, password});
            expect(loggedInUser).toHaveProperty('verificationCode');
            expect(loggedInUser).toHaveProperty('email', user.email);
            expect(loggedInUser).toHaveProperty('fullName', user.fullName);
            expect(loggedInUser).toHaveProperty('password');
            expect(loggedInUser).toHaveProperty('isAdmin', false);
            expect(loggedInUser).toHaveProperty('isVerified', true);
            expect(loggedInUser).toHaveProperty('accessToken');

        });
    });

    describe('verify', () => {
        it('should return logged in user', async () => {
            const user = await fakeEntitiesService.createUser({isVerified: false});
            const loggedInUser = await authService.verifyAndLogin({ code: user.verificationCode});
            expect(loggedInUser).toHaveProperty('verificationCode');
            expect(loggedInUser).toHaveProperty('email', user.email);
            expect(loggedInUser).toHaveProperty('fullName', user.fullName);
            expect(loggedInUser).toHaveProperty('password');
            expect(loggedInUser).toHaveProperty('isAdmin', false);
            expect(loggedInUser).toHaveProperty('isVerified', true);
            expect(loggedInUser).toHaveProperty('accessToken');

        });
    });

    //jest.spyOn(catsService, 'findAll').mockImplementation(() => result);
});
