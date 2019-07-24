import {ClassSerializerInterceptor, Inject, Injectable, UseInterceptors} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoggerService } from 'nest-logger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';



@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly logger: LoggerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.userRepository.create(createUserDto);
    return this.userRepository.save(createdUser);
  }

  async flushAll() {
    return this.userRepository.delete({});
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
