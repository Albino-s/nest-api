import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards, BadRequestException, UnauthorizedException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';
import {SignupUserTransformer} from '../auth/transformers/signup-user.transformer';
import {LoggerService} from 'nest-logger';
import { AuthGuard } from '@nestjs/passport';
import { ApiUnauthorizedResponse, ApiBearerAuth, ApiOkResponse, ApiUseTags } from '@nestjs/swagger';
import {LoginUserTransformer} from '../auth/transformers/login-user.transformer';
import {OptionalJwtAuthGuard} from '../auth/optional.jwt.guard';


@ApiUseTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService,
             // private readonly logger: LoggerService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Returns users data.', type: [SignupUserTransformer] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
  async findAll(): Promise<SignupUserTransformer[]> {
    const users = await this.usersService.findAll();
    return users.map(u => (new SignupUserTransformer(u)));
  }

  @Get('me')
  @UseGuards(OptionalJwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ description: 'Returns current user.', type: SignupUserTransformer })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
  async me(@Req() req): Promise<SignupUserTransformer> {
    if (!req.user) {
      throw new UnauthorizedException('Authorization is required. Please set proper Bearer token.');
    }
    const users = await this.usersService.findAll();
    return new SignupUserTransformer(req.user);
  }
}
