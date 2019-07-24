export default {
    secret: process.env.JWT_PRIVATE_KEY || '9gADuAhL3umuu8jf284g',
    signOptions: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES || 3600,
    },
};
