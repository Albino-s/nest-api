import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {UsersModule} from './users.module';
import {INestApplication} from '@nestjs/common';
import {TestDatabaseModule} from '../../database/test-database.module';
import {ApplicationModule} from '../../app.module';
import {entitiesCreateMethods, FakeEntitiesService} from '../../tests/fake.entities.service';
import {FakeEntitiesModule} from '../../tests/fake.entities.module';
import {TestAuthService} from '../../tests/test-auth.service';
import {TypeOrmConfigService} from '../../database/typeorm.coinfig.service';
import {TestTypeormCoinfigService} from '../../database/test-typeorm.coinfig.service';
import {User} from './entities/user.entity';
import {TestApplicationModule} from '../../tests/test-app.module';

describe('Users', () => {
    let app: INestApplication;
    let fakeEntitiesService: FakeEntitiesService;
    let testAuthService: TestAuthService;
    let authUserData = null;

    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        const module = await Test.createTestingModule({
            imports: [
                //TestDatabaseModule,
                FakeEntitiesModule,
                TestApplicationModule,
                UsersModule,
            ],
        })
            .compile();

        app = module.createNestApplication();
        await app.init();
        fakeEntitiesService = module.get<FakeEntitiesService>(FakeEntitiesService);
        testAuthService = new TestAuthService(app, fakeEntitiesService);
    });

    beforeEach(async () => {
        authUserData = await testAuthService.createUserAndLogin();
    });

    afterEach(async () => {
        await fakeEntitiesService.flushAllUsers();
    });


    it(`/GET users`, async () => {
        const createdUsersCount = 5;
        await fakeEntitiesService.createMany(User, createdUsersCount);
        const response = await request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${authUserData.accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(createdUsersCount + 1);
        response.body.map(user => {
           expect(user).toHaveProperty('fullName');
           expect(user).toHaveProperty('email');
        });
    });

    it(`/GET users/me`, async () => {
        const createdUsersCount = 5;
        await fakeEntitiesService.createMany(User, createdUsersCount);
        const response = await request(app.getHttpServer())
            .get('/users/me')
            .set('Authorization', `Bearer ${authUserData.accessToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('fullName', authUserData.fullName);
        expect(response.body).toHaveProperty('email', authUserData.email);
        expect(response.body).toHaveProperty('isVerified', authUserData.isVerified);
    });

    afterAll(async () => {
        await app.close();
    });
});
