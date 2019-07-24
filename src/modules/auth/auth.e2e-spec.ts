import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {TestDatabaseModule} from '../../database/test-database.module';
import {ApplicationModule} from '../../app.module';
import {entitiesCreateMethods, FakeEntitiesService} from '../../tests/fake.entities.service';
import {FakeEntitiesModule} from '../../tests/fake.entities.module';
import {TestAuthService} from '../../tests/test-auth.service';
import {TypeOrmConfigService} from '../../database/typeorm.coinfig.service';
import {TestTypeormCoinfigService} from '../../database/test-typeorm.coinfig.service';
import {User} from '../users/entities/user.entity';
import {TestApplicationModule} from '../../tests/test-app.module';
import {AuthModule} from './auth.module';
import * as faker from "faker";
import * as bcrypt from 'bcrypt';
import {VerifyUserMailer} from '../../emails/verify-user.mailer';

describe('Users', () => {
    let app: INestApplication;
    let fakeEntitiesService: FakeEntitiesService;
    let testAuthService: TestAuthService;
    let authUserData = null;
    let verifyUserMailer: VerifyUserMailer;

    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        const module = await Test.createTestingModule({
            imports: [
                //TestDatabaseModule,
                FakeEntitiesModule,
                TestApplicationModule,
                AuthModule,
            ],
        })
            .compile();

        app = module.createNestApplication();
        await app.init();
        fakeEntitiesService = module.get<FakeEntitiesService>(FakeEntitiesService);
        testAuthService = new TestAuthService(app, fakeEntitiesService);
        verifyUserMailer = module.get<VerifyUserMailer>(VerifyUserMailer);
    });

    beforeEach(async () => {
        authUserData = await testAuthService.createUserAndLogin();
    });

    afterEach(async () => {
        await fakeEntitiesService.flushAllUsers();
    });


    it(`/POST auth/signup`, async () => {
        jest.spyOn(verifyUserMailer, 'send').mockImplementation(async () => ({success: true}));
        const password = faker.random.alphaNumeric(30);
        const userDto = {
            fullName: faker.name.findName(),
            email: faker.internet.email(),
            password,
            passwordConfirmation: password,
        };
        const response = await request(app.getHttpServer())
            .post('/auth/signup')
            .send(userDto);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('verificationCode');
        expect(response.body).toHaveProperty('email', userDto.email);
        expect(response.body).toHaveProperty('fullName', userDto.fullName);
        expect(response.body).toHaveProperty('password', undefined);
        expect(response.body).toHaveProperty('isAdmin', false);
        expect(response.body).toHaveProperty('isVerified', false);
    });

    it(`/GET auth/login`, async () => {
        const password = 'stronger than hell';
        const cryptPass = await bcrypt.hashSync(password, 11);
        const user = await fakeEntitiesService.createUser({isVerified: true, password: cryptPass});
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({email: user.email, password});
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('verificationCode', undefined);
        expect(response.body).toHaveProperty('password', undefined);
        expect(response.body).toHaveProperty('email', user.email);
        expect(response.body).toHaveProperty('fullName', user.fullName);
        expect(response.body).toHaveProperty('isAdmin', false);
        expect(response.body).toHaveProperty('isVerified', true);
        expect(response.body).toHaveProperty('accessToken');
    });

    it(`/GET users/login`, async () => {
        const user = await fakeEntitiesService.createUser({isVerified: false});
        const response = await request(app.getHttpServer())
            .post('/auth/verify')
            .send({code: user.verificationCode});
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('verificationCode', undefined);
        expect(response.body).toHaveProperty('password', undefined);
        expect(response.body).toHaveProperty('email', user.email);
        expect(response.body).toHaveProperty('fullName', user.fullName);
        expect(response.body).toHaveProperty('isAdmin', false);
        expect(response.body).toHaveProperty('isVerified', true);
        expect(response.body).toHaveProperty('accessToken');
    });

    afterAll(async () => {
        await app.close();
    });
});
