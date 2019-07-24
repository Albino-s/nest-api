import {NestApplication} from '@nestjs/core';
import {ExceptionHandler} from '@nestjs/core/errors/exception-handler';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import {FakeEntitiesService} from './fake.entities.service';
import {INestApplication} from '@nestjs/common';

export class TestAuthService {

    private app: INestApplication;
    private fakeEntitiesService: FakeEntitiesService;

    constructor(app: INestApplication, fakeEntitiesService: FakeEntitiesService) {
        this.app = app;
        this.fakeEntitiesService = fakeEntitiesService;
    }

    async login(email, password) {
        const resp = await request(this.app.getHttpServer())
            .post('/auth/login')
            .send({
                email,
                password,
            });
        if (resp.status !== 200) {
            throw new Error('Login error');
        }
        return resp.body;
    }

    async createUserAndLogin() {
        const password = 'stronger than hell';
        const cryptPass = await bcrypt.hashSync(password, 11);
        const fakeUser = await this.fakeEntitiesService.createUser({password: cryptPass, isVerified: true});
        return this.login(fakeUser.email, password);
    }
}
