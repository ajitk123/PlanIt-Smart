import { Router } from 'express';
const router = Router();

router
.route('/courses')
.get(async (req, res) => {
    // getting all courses

})
.post(async (req, res) => {
    // adding a course

})

.route('/courses/:id')
.delete(async (req, res) => {
    // for deleting a course
    
})

export default router;