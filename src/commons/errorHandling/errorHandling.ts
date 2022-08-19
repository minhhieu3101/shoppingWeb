export const ERROR = {
    //system
    SYSTEM_ERROR: {
        statusCode: 500,
        message: 'System is error',
    },

    // user
    USER_NOT_FOUND: {
        statusCode: 400,
        message: 'User not found',
    },
    USERNAME_OR_PASSWORD_INCORRECT: {
        statusCode: 400,
        message: 'Username or password is incorrect',
    },
    USERNAME_OR_EMAIL_EXISTED: {
        statusCode: 400,
        message: 'Username or email is exist',
    },
    USER_EXISTED: {
        statusCode: 409,
        message: 'User found',
    },
};
