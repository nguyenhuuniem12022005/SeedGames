import authRouter from './auth.route.js';
import problemsRouter from './problems.route.js';
import coursesRouter from './courses.route.js';
import contestsRouter from './contests.route.js';

function route(app){
    app.use('/api/auth', authRouter);
    app.use('/api/problems', problemsRouter);
    app.use('/api/courses', coursesRouter);
    app.use('/api/contests', contestsRouter);
}

export default route;