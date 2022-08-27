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
    PASSWORD_INCORRECT: {
        statusCode: 400,
        message: 'password is incorrect',
    },
    USERNAME_OR_EMAIL_EXISTED: {
        statusCode: 400,
        message: 'Username or email is exist',
    },
    USER_EXISTED: {
        statusCode: 409,
        message: 'User found',
    },
    USER_IS_VERIFIED: {
        statusCode: 400,
        message: 'This account is verify',
    },
    USER_IS_NOT_VERIFIED: {
        statusCode: 400,
        message: 'This account is not verified',
    },
    ACTIVECODE_IS_WRONG: {
        statusCode: 400,
        message: 'Acitve code is wrong',
    },
    USER_IS_ADMIN: {
        statusCode: 400,
        message: 'This user is admin',
    },

    //category
    CATEGORY_NOT_FOUND: {
        message: 'Category not found',
        statusCode: 400,
    },
    CATEGORY_IS_EXIST: {
        statusCode: 400,
        message: 'Category name is exist',
    },
    CATEGORY_NOT_HAVE_PRODUCT: {
        statusCode: 400,
        message: 'This category do not have any product',
    },
    CATEGORY_IS_INACTIVE: {
        statusCode: 400,
        message: 'This category is inactive',
    },
    CATEGORY_IS_ACTIVE: {
        statusCode: 400,
        message: 'This category is active',
    },

    //PRODUCT
    PRODUCT_NOT_FOUND: {
        message: 'PRODUCT not found',
        statusCode: 400,
    },
    PRODUCT_IS_EXIST: {
        statusCode: 400,
        message: 'PRODUCT name is exist',
    },
    PRODUCT_IS_OUT_OF_STOCK: {
        statusCode: 400,
        message: 'This PRODUCT is out of stock',
    },
    PRODUCT_IS_UNAVAILABLE: {
        statusCode: 400,
        message: 'This PRODUCT is unavailable',
    },
    PRODUCT_IS_ACTIVE: {
        statusCode: 400,
        message: 'This PRODUCT is active',
    },
};
