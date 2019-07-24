import { ConfigService, ConfigModule } from 'nestjs-config';
import {ClassSerializerInterceptor, Inject, Injectable, UseInterceptors} from '@nestjs/common';
import { TypeOrmModule, TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TestTypeormCoinfigService implements TypeOrmOptionsFactory {
    constructor(
        private readonly config: ConfigService,
    ) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.config.get('database.mysql-test.host'),
            port: this.config.get('database.mysql-test.port'),
            username: this.config.get('database.mysql-test.username'),
            password: this.config.get('database.mysql-test.password'),
            database: this.config.get('database.mysql-test.database'),
            entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
            synchronize: true,
        };
    }
}


