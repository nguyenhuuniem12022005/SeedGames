import { Router } from 'express';
import * as contestsController from '../app/controllers/contests.controller.js';
import requireAuthentication from '../app/middleware/common/require-authentication.js';
import validate from '../app/middleware/common/validate.js';
import * as contestsRequest from '../app/requests/contests.request.js';

const contestsRouter = Router();

// Public: list all contests
contestsRouter.get('/', contestsController.listContests);

// Public: get contest by id
contestsRouter.get('/:id', contestsController.getContestById);

// Public: get contest rankings
contestsRouter.get('/:id/rankings', contestsController.getContestRankings);

// Protected: register user to contest
contestsRouter.post('/:id/register', requireAuthentication, contestsController.registerContest);

// Protected: create a new contest
contestsRouter.post(
  '/',
  // requireAuthentication,
  validate(contestsRequest.createContest),
  contestsController.createContest
);

// Protected: update a contest
contestsRouter.put(
  '/:id',
  // requireAuthentication,
  validate(contestsRequest.updateContest),
  contestsController.updateContest
);

// Protected: delete a contest
contestsRouter.delete('/:id', requireAuthentication, contestsController.deleteContest);

export default contestsRouter;
