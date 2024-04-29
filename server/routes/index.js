import taskRoutes from './tasks.js';
import courseRoutes from './courses.js';
  
const constructorMethod = (app) => {
    app.use('/tasks', taskRoutes);
    app.use('/courses', courseRoutes);
  
    app.use('*', (req, res) => {
      res.status(404).json({error: 'Route Not found'});
    });
};

export default constructorMethod;