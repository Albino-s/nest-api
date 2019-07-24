import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {FakeEntitiesService} from './fake.entities.service';
import {TestDatabaseModule} from '../database/test-database.module';
import {LoggerModule} from '../logging/logger.module';
import {User} from '../modules/users/entities/user.entity';

@Module({
    imports: [
        LoggerModule,
        TestDatabaseModule,
        TypeOrmModule.forFeature([User]),
    ],
    providers: [
        FakeEntitiesService,
    ],
    exports: [ FakeEntitiesService ],
})
export class FakeEntitiesModule {}
