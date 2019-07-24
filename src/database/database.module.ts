import { Module, Global } from '@nestjs/common';
import { TypeOrmModule, TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {TypeOrmConfigService} from './typeorm.coinfig.service';

@Global()
@Module({
  imports: [
      TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService,
      })
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
