import { Router } from 'express';
import courseDataFunctions from '../data/courses.js';

const router = Router();

router
.route('/')
.get(async (req, res) => {
    //get all courses
    const courses = await courseDataFunctions.getAllCourses();
    res.json(courses);
    
})
.post(async (req, res) => {
    // adding a course
    const {title} = req.body;
    const course = await courseDataFunctions.addCourse(title);
    res.json(course);
})

router.route('/:id')
.get(async (req, res) => {
    // for deleting a course
    let {id} = req.params;
    const course = await courseDataFunctions.getCourseById(id);
    res.json(course);
})
.delete(async (req, res) => {
    // for deleting a course
    let {id} = req.params;
    try {
        await courseDataFunctions.deleteCourse(id);
        return res.status(200).json({message: "course deleted successfully"});
    } catch(e) {
        res.status(404).send("error, invalid id");
    }

})

export default router;
