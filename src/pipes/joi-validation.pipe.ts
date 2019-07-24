import * as joi from '@hapi/joi';
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private readonly schema: object) {}

    transform(value: any, metadata: ArgumentMetadata) {
        const  res  = joi.validate(value, this.schema);
        if (res.error) {
            throw new UnprocessableEntityException(res.error.details);
        }
        return value;
    }
}
