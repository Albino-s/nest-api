import { ApiModelProperty } from '@nestjs/swagger';

export class VerifyUserDto {

  @ApiModelProperty()
  readonly code: string;

}
