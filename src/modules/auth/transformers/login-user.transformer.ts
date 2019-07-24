import {Exclude, Expose} from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';


export class LoginUserTransformer {

    @ApiModelProperty({ example: 1})
    id: number;

    @ApiModelProperty()
    fullName: string;

    @ApiModelProperty()
    email: string;

    @ApiModelProperty()
    accessToken: string;

    @ApiModelProperty()
    expiresIn: string;

    @ApiModelProperty()
    isAdmin: boolean;

    @ApiModelProperty()
    isVerified: boolean;

    @ApiModelProperty()
    createdAt: string;

    @ApiModelProperty()
    updatedAt: string;

    @Exclude()
    password: string;

    @Exclude()
    verificationCode: string;


    constructor(partial: Partial<LoginUserTransformer>) {
        Object.assign(this, partial);
    }
}
