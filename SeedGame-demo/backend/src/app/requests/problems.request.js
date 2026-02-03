import Joi from 'joi';

export const submitProblem = Joi.object({
    // userId: Joi.number()
    //     .optional()
    //     .label('User ID'),
    problemId: Joi.number()
        .required()
        .label('Problem ID'),
    codeContent: Joi.string()
        .required()
        .label('Mã code'),
    status: Joi.string()
        .optional()
        .label('Trạng thái'),
    // judgeResult: Joi.string()
    //     .optional()
    //     .label('Kết quả chấm')
});
