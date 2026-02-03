import { Router } from 'express';
import * as authController from '../app/controllers/auth.controller.js';
import requireAuthentication from '../app/middleware/common/require-authentication.js';
import validate from '../app/middleware/common/validate.js';
import * as authRequest from '../app/requests/auth.request.js';

const authRouter = Router();

authRouter.post(
    '/register',
    validate(authRequest.register),
    authController.register
);

authRouter.post(
    '/login',
    validate(authRequest.login),
    authController.login
);

authRouter.post(
    '/logout',
    requireAuthentication,
    authController.logout
);

authRouter.patch(
    '/:email/reset-password',
    validate(authRequest.resetPassword),
    authController.resetPassword
);

export default authRouter;