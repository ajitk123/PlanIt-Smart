import { Router } from 'express';
import { courses, tasks } from '../config/mongoCollections.js'
const router = Router();

router
.route('/tasks')
.get(async (req, res) => {
    const tasks = await tasks();
    res.json(tasks);

})
.post(async (req, res) => {
    // adding a task, return the new task

    const task = req.body;
    const tasks = await tasks();
    const newTask = await tasks.insertOne(task);
    res.json(newTask);
    

})

.route('/tasks/:courseId')
.get(async (req, res) => {
    // get all tasks for a course

    const courseId = req.params.courseId;
    const tasks = await tasks();
    const courseTasks = await tasks.find({courseId: courseId}).toArray();
    res.json(courseTasks);
    
})

.route('/tasks/:id')
.delete(async (req, res) => {
    // deleting a task
    
    const id = req.params.id;
    const tasks = await tasks();
    const task = await tasks.findOne({_id: id});
    if (!task) {
        res.status(404).json({error: 'Task not found'});
        return;
    }
    await tasks.deleteOne({_id: id});
    res.json(task);
    
})


