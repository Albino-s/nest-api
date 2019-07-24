import { ApiModelProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiModelProperty()
  readonly fullName: string;

  @ApiModelProperty()
  readonly email: string;

  @ApiModelProperty()
  password: string;

  @ApiModelProperty()
  passwordConfirmation: string;

  @ApiModelProperty()
  verificationCode?: string;
}
