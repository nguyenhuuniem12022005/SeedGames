import { Router } from 'express';
import * as coursesController from '../app/controllers/courses.controller.js';
import requireAuthentication from '../app/middleware/common/require-authentication.js';
import validate from '../app/middleware/common/validate.js';
import * as coursesRequest from '../app/requests/courses.request.js';

const coursesRouter = Router();

// Public: list all published courses
coursesRouter.get('/', coursesController.listCourses);

// Public: get course by id
coursesRouter.get('/:id', coursesController.getCourseById);

// Public: get course module
coursesRouter.get('/:courseId/modules/:moduleId', coursesController.getModule);

// Protected: create a new course
coursesRouter.post(
  '/',
  // requireAuthentication,
  validate(coursesRequest.createCourse),
  coursesController.createCourse
);

// Protected: update a course
coursesRouter.put(
  '/:id',
  // requireAuthentication,
  validate(coursesRequest.updateCourse),
  coursesController.updateCourse
);

// Protected: delete a course
coursesRouter.delete(
  '/:id', 
  requireAuthentication,
  coursesController.deleteCourse);

export default coursesRouter;
