import {BadRequestException, Inject, Injectable, UnprocessableEntityException} from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { LoggerService } from 'nest-logger';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as uuidv4 from 'uuid/v4';
import {JwtPayload} from './interfaces/jwt-payload.interface';
import { ConfigService } from 'nestjs-config';
import {LoginUserDto} from './dto/login-user.dto';
import {VerifyUserDto} from './dto/verify-user.dto';
import {SignupUserDto} from './dto/signup-user.dto';
import { MailerService } from '@nest-modules/mailer';
import {VerifyUserMailer} from '../../emails/verify-user.mailer';
import {CustomValidationException} from '../../filters/custom-validation.exception';
import {Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class AuthService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private readonly logger: LoggerService,
      private readonly jwtService: JwtService,
      private readonly config: ConfigService,
      private readonly mailerService: MailerService,
      private readonly verifyUserMailer: VerifyUserMailer,
  ) {}



  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ id });
  }

  async findByCode(code: string): Promise<User> {
    return this.userRepository.findOne({ verificationCode: code });
  }

  async signup(createUserDto: SignupUserDto): Promise<User> {
    return this.findByEmail(createUserDto.email)
        .then(async (userData) => {
          if (userData) {
            throw new CustomValidationException('email', 'User with such email is already exists');
          }
          createUserDto.password = await bcrypt.hashSync(createUserDto.password, 11);
          createUserDto.verificationCode = uuidv4();
          const createdUser = await this.userRepository.save(createUserDto);
          await this.verifyUserMailer.send(createdUser);
          return createdUser;
        });
  }

  public async login(loginData: LoginUserDto): Promise< any | { status: number }>{
    return this.findByEmail(loginData.email).then((userData) => {
      if (!userData) {
          throw new CustomValidationException('email', 'User not found');
      }
      if (!userData.isVerified) {
        throw new BadRequestException('User not verified. Check your email and pass verification.');
      }
      const passwordConfirmation = bcrypt.compareSync(loginData.password, userData.password);
      if (!passwordConfirmation) {
          throw new BadRequestException('Invalid username or password');
      }
      return this.getLoginResponseData(userData);
    });
  }

  private getLoginResponseData(userData: User) {
      const payload: JwtPayload  = {
          id: userData.id,
          fullName: userData.fullName,
          isAdmin: userData.isAdmin,
      };
      const accessToken = this.jwtService.sign(payload);

      return {
          expiresIn: this.config.get('jwt.signOptions.expiresIn'),
          accessToken,
          ...userData,
      };
  }

  public async verifyAndLogin(verificationData: VerifyUserDto) {
      return this.findByCode(verificationData.code).then((userData) => {
          if (!userData) {
              throw new BadRequestException('Code is not exists');
          }
          if (userData.isVerified) {
              throw new BadRequestException('Email was already verified');
          }
          userData.isVerified = true;
          this.userRepository.save(userData);
          return this.getLoginResponseData(userData);
      });
  }

  async findAll(): Promise<User[]> {
    this.logger.debug('Hey');
    return await this.userRepository.find();
  }

  async validateUser(payload) {
      return this.findById(payload.id);
  }
}
