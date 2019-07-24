export default {
    port: process.env.API_PORT || 3000,
    frontendURL: process.env.FRONTEND_URL || 'http://localhost:3000',
    frontendVerificationPath: process.env.FRONTEND_VERIFICATION_PATH || 'verify',
    property: {
        http: {
            timeout: process.env.HTTP_TIMEOUT || 5000,
            maxRedirects: process.env.HTTP_MAX_REDIRECTS || 5,
        },
    },
};
