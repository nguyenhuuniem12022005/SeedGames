import { Router } from 'express';
import * as problemsController from '../app/controllers/problems.controller.js';
import requireAuthentication from '../app/middleware/common/require-authentication.js';
import validate from '../app/middleware/common/validate.js';
import * as problemsRequest from '../app/requests/problems.request.js';

const problemsRouter = Router();

problemsRouter.get(
    '/',
    problemsController.getAllProblems
);

problemsRouter.get(
    '/:idOrSlug',
    problemsController.getProblemDetail
);

problemsRouter.post(
    '/submit',
    // requireAuthentication,
    validate(problemsRequest.submitProblem),
    problemsController.submitProblem
);

problemsRouter.get(
    '/:problemId/submissions/:userId',
    // requireAuthentication,
    problemsController.getUserSubmissions
);

export default problemsRouter;
