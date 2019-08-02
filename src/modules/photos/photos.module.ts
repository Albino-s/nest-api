import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosController } from './photos.controller';
import { Photo } from './entities/photo.entity';
import { PhotosService } from './photos.service';
import {LoggerModule} from '../../logging/logger.module';
import {TypeOrmConfigService} from '../../database/typeorm.coinfig.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([Photo]),
      LoggerModule
  ],
  providers: [PhotosService],
  controllers: [PhotosController]
})
export class PhotosModule {}
