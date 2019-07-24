import * as Joi from '@hapi/joi';

export const VerificationValidationSchema = Joi.object().keys({
    code: Joi.string().required(),
});
