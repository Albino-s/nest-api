import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { User} from './entities/user.entity';
import {ClassSerializerInterceptor, UseInterceptors} from '@nestjs/common';
import {ConfigModule} from 'nestjs-config';
import {LoggerModule} from '../../logging/logger.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import * as faker from 'faker';
import {FakeEntitiesService} from '../../tests/fake.entities.service';
import * as path from "path";
import {TestDatabaseModule} from '../../database/test-database.module';
import {FakeEntitiesModule} from '../../tests/fake.entities.module';



describe('UsersController', () => {

    let usersController: UsersController;
    let usersService: UsersService;
    let fakeEntitiesService: FakeEntitiesService;

    beforeEach(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000; // this important for Mockoose to work with Jest
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.load(path.resolve(__dirname + '/../../', 'config', '**/!(*.d).{ts,js}')),
                TestDatabaseModule,
                TypeOrmModule.forFeature([User]),
                FakeEntitiesModule,
                LoggerModule,
            ],
            controllers: [UsersController],
            providers: [UsersService],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        usersController = module.get<UsersController>(UsersController);
        fakeEntitiesService = module.get<FakeEntitiesService>(FakeEntitiesService);
    });

    afterEach(async () => {
        await fakeEntitiesService.flushAllUsers();
        await fakeEntitiesService.connectionClose();
    });

    describe('findAll', () => {
        it('should return an array users', async () => {
            try {
                const users = await fakeEntitiesService.createMany(User, 5);
            } catch (e) {
                console.log(e);
            }
            const allUsers = await usersService.findAll();
            const serialized = (new ClassSerializerInterceptor([]))
                .serialize(allUsers, {});

            expect(serialized.length).toBe(5);
            serialized.map(user => {
                expect(user).toHaveProperty('fullName');
                expect(user).toHaveProperty('email');
                expect(user).toHaveProperty('isAdmin', false);
                expect(user).toHaveProperty('isVerified', false);
            });
        });
    });

    describe('create', () => {
        it('should return newly created user', async () => {

            const userData = {
                fullName: faker.name.findName(),
                email: faker.internet.email(),
                password: faker.random.alphaNumeric(30),
                passwordConfirmation:'',
            };
            const user = await usersService.create(userData);
            const serialized = (new ClassSerializerInterceptor([]))
                .serialize(user, {});
            expect(serialized).toHaveProperty('fullName', userData.fullName);
            expect(serialized).toHaveProperty('email', userData.email);
            expect(serialized).toHaveProperty('isAdmin', false);
            expect(serialized).toHaveProperty('isVerified', false);
        });
    });

});
