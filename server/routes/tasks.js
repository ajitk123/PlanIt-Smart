import { Router } from 'express';
const router = Router();

router
.route('/tasks')
.get(async (req, res) => {
    // getting all tasks

})
.post(async (req, res) => {
    // adding a task, return the new task

})

.route('/tasks/:courseId')
.get(async (req, res) => {
    // getting all the tasks under the same course
    
})

.route('/tasks/:id')
.delete(async (req, res) => {
    // deleting a task
    
})


