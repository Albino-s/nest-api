import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  HttpCode,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import {JoiValidationPipe} from '../../pipes/joi-validation.pipe';
import {SignupUserValidationSchema} from './validation/signup-user.schema';
import {AuthService} from './auth.service';
import {SignupUserTransformer} from './transformers/signup-user.transformer';
import {LoggerService} from 'nest-logger';
import {LoginUserTransformer} from './transformers/login-user.transformer';
import {LoginUserValidationSchema} from './validation/login-user.schema';
import { ConfigService } from 'nestjs-config';
import {VerificationValidationSchema} from './validation/verify-user.schema';
import {SignupUserDto} from './dto/signup-user.dto';
import {LoginUserDto} from './dto/login-user.dto';
import {VerifyUserDto} from './dto/verify-user.dto';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnprocessableEntityResponse,
  ApiOkResponse,
  ApiUseTags,
} from '@nestjs/swagger';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService,
              private readonly logger: LoggerService,
              private readonly config: ConfigService,
  ) {}

  @Post('signup')
  @ApiCreatedResponse({ description: 'The record has been successfully created.', type: SignupUserTransformer})
  @ApiUnprocessableEntityResponse({description: [
      'Validation errors',
      'User with such email is already exists'].join('\n')
  })
  @UsePipes(new JoiValidationPipe(SignupUserValidationSchema))
  @UseInterceptors(ClassSerializerInterceptor)
  async signup(@Body() createUserDto: SignupUserDto): Promise<SignupUserTransformer> {
    const user = await this.authService.signup(createUserDto);
    return new SignupUserTransformer(user);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Returns user data.', type: LoginUserTransformer})
  @ApiUnprocessableEntityResponse({description: ['Validation errors', 'User not found'].join('\n')})
  @ApiBadRequestResponse({ description: 'Invalid username or password' })
  @UsePipes(new JoiValidationPipe(LoginUserValidationSchema))
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() loginData: LoginUserDto): Promise<LoginUserTransformer> {
    const data = await this.authService.login(loginData);
    return new LoginUserTransformer(data);
  }

  @Post('verify')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Returns user data.', type: LoginUserTransformer })
  @ApiUnprocessableEntityResponse({description: 'Validation errors'})
  @ApiBadRequestResponse({ description: 'Code is not exists' })
  @ApiBadRequestResponse({ description: 'Email was already verified' })
  @UsePipes(new JoiValidationPipe(VerificationValidationSchema))
  @UseInterceptors(ClassSerializerInterceptor)
  async verify(@Body() verificationData: VerifyUserDto): Promise<LoginUserTransformer> {
    const data = await this.authService.verifyAndLogin(verificationData);
    return new LoginUserTransformer(data);
  }

}
