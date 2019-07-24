import {UnprocessableEntityException} from '@nestjs/common';

export class CustomValidationException extends UnprocessableEntityException {
    constructor(field: string, message: string, type: string = 'any.exists') {
        super({
                statusCode: 422,
                error: 'Unprocessable Entity',
                message: [{
                    message,
                    path: [
                        field,
                    ],
                    type,
                    context: {
                        value: '',
                        key: field,
                        label: field,
                    },
                }],
            },
        );
    }
}
