import { ApiModelProperty } from '@nestjs/swagger';

export class SignupUserDto {

  @ApiModelProperty({ example: 'John Doe'})
  readonly fullName: string;

  @ApiModelProperty({ example: 'john@example.com'})
  readonly email: string;

  @ApiModelProperty()
  password: string;

  @ApiModelProperty()
  passwordConfirmation: string;

  verificationCode?: string;
}
