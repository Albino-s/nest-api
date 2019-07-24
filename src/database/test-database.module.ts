import { Module, Global } from '@nestjs/common';
import { TypeOrmModule, TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {TestTypeormCoinfigService} from './test-typeorm.coinfig.service';

@Global()
@Module({
  imports: [
      TypeOrmModule.forRootAsync({
        useClass: TestTypeormCoinfigService,
      })
  ],
  exports: [TypeOrmModule],
})
export class TestDatabaseModule {}
