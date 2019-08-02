import {ClassSerializerInterceptor, Inject, Injectable, UseInterceptors} from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
import { Photo } from './entities/photo.entity';
import { LoggerService } from 'nest-logger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';



@Injectable()
export class PhotosService {
  constructor(
      @InjectRepository(Photo)
      private readonly photoRepository: Repository<Photo>,
      private readonly logger: LoggerService,
  ) {}

  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   const createdUser = await this.userRepository.create(createUserDto);
  //   return this.userRepository.save(createdUser);
  // }

  async flushAll() {
    return this.photoRepository.delete({});
  }

  async findAll(): Promise<Photo[]> {
    return this.photoRepository.find();
  }
}
