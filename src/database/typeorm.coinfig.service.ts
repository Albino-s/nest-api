import { ConfigService, ConfigModule } from 'nestjs-config';
import {ClassSerializerInterceptor, Inject, Injectable, UseInterceptors} from '@nestjs/common';
import { TypeOrmModule, TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(
        private readonly config: ConfigService,
    ) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.config.get('database.mysql.host'),
            port: this.config.get('database.mysql.port'),
            username: this.config.get('database.mysql.username'),
            password: this.config.get('database.mysql.password'),
            database: this.config.get('database.mysql.database'),
            entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
            synchronize: true,
        };
    }
}


