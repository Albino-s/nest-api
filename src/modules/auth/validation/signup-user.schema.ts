import * as Joi from '@hapi/joi';

export const SignupUserValidationSchema = Joi.object().keys({
    fullName: Joi.string().regex(/^[a-zA-Z]{1}[a-zA-Z\-'\s]{1,100}[a-zA-Z]{1}$/i, 'full name, e.g. "John Doe"')
        .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
    passwordConfirmation: Joi.any().valid(Joi.ref('password')).required()
        .options({ language: { any: { allowOnly: 'must match password' } } }),
});
