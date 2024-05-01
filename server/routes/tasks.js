import { Router } from 'express';
import courseDataFunctions from '../data/courses.js';
const router = Router();


router
.route('/')
.get(async (req, res) => {
    const tasks = await courseDataFunctions.getAllTasks();
    res.json(tasks);
})
.post(async (req, res) => {
    // adding a task, return the new task
    let { description, 
            courseId, 
            due_date, course_title } = req.body;

    const newTask = await courseDataFunctions.addTaskToCourse(description, courseId, due_date, course_title);
    console.log(newTask);
    res.json(newTask);

})

router.route('/:courseId')
.get(async (req, res) => {
    // get all tasks for a course

    let {courseId} = req.params;

    const tasks = await courseDataFunctions.getAllTasksFromCourse(courseId);

    return res.json(tasks);
})

router.route('/:id')
.delete(async (req, res) => {
    // deleting a task
    let {id} = req.params;
    await courseDataFunctions.deleteTask(id);
    res.status(200).send("deleted successfully!");
})

export default router;

