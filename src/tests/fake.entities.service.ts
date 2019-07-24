import {BadRequestException, ClassSerializerInterceptor, Inject, Injectable, UseInterceptors} from '@nestjs/common';
import { User } from '../modules/users/entities/user.entity';
import { LoggerService } from 'nest-logger';
import * as faker from 'faker';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectType } from 'typeorm';


export enum entitiesCreateMethods {
    createUser = 'createUser',
    createBid = 'createBid',
    createOwnership = 'createOwnership',
}

@Injectable()
export class FakeEntitiesService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly logger: LoggerService,
    ) {
    }



    async flushAllUsers() {
        return this.userRepository.clear();
    }

    async connectionClose() {
        return this.userRepository.metadata.connection.close();
    }


    async createUser(customFields: Partial<User>): Promise<User> {
        const password = customFields.password || faker.random.alphaNumeric(30);
        const createdUser = {
            fullName: customFields.fullName || faker.name.findName(),
            email: customFields.email || faker.internet.email(),
            password,
            isAdmin: customFields.isAdmin || false,
            isVerified: customFields.isVerified || false,
            verificationCode: customFields.verificationCode || faker.random.alphaNumeric(20),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return await this.userRepository.save(createdUser);
    }


    async createManyOld(method: entitiesCreateMethods, count: number = 1, customFields = {}) {
        const res = [];
        for (let i = 0; i < count; i++) {
            // @ts-ignore
            const entity = await this[method](customFields);
            res.push(entity);
        }
        return res;
    }

    async createMany<T>(entityClassOrName: ObjectType<T> | string, count: number = 1, customFields = {}): Promise<T[]> {
        const res = [];
        for (let i = 0; i < count; i++) {
            let entity;
            switch (entityClassOrName) {
                case User:
                    entity = await this.createUser(customFields);
                    break;
                default:
                    throw new Error('Unknown entity '+ entityClassOrName);
            }
            res.push(entity);
        }
        return res;
    }

    authToken(user: User) {

    }
}
