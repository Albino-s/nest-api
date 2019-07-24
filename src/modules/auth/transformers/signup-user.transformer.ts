import { Exclude } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';


export class SignupUserTransformer {
    @ApiModelProperty({ example: 1})
    id: number;

    @ApiModelProperty({ example: 'John Doe'})
    fullName: string;

    @ApiModelProperty({ example: 'john@example.com'})
    email: string;

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


    verificationCode: string;


    constructor(partial: Partial<SignupUserTransformer>) {
        Object.assign(this, partial);
    }
}
