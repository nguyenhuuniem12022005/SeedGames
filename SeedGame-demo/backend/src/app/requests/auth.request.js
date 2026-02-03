import Joi from 'joi';

export const login = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(255)
        .required()
        .label('Email'),
    password: Joi.string()
        .min(6)
        .max(255)
        .required()
        .label('Mật khẩu')
});

export const register = Joi.object({
    username: Joi.string()
        .trim()
        .min(6)
        .max(255)
        .required()
        .label('Họ và tên'),
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(255)
        .required()
        .label('Email'),
    password: Joi.string()
        .min(6)
        .max(255)
        .required()
        .label('Mật khẩu')
});

export const resetPassword = Joi.object({
    // email: Joi.string()
    //     .trim()
    //     .lowercase()
    //     .email()
    //     .max(255)
    //     .required()
    //     .label('Email'),
    password: Joi.string()
        .min(6)
        .max(255)
        .required()
        .label('Mật khẩu mới')
});