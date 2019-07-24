import * as Joi from '@hapi/joi';

export const LoginUserValidationSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
});
