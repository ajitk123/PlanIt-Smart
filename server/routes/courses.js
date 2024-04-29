import { Router } from 'express';
import { courses, tasks } from '../config/mongoCollections.js'
const router = Router();

router
.route('/courses')
.get(async (req, res) => {
    //get all courses

    const courses = await courses();

    res.json(courses);
    
})


.post(async (req, res) => {
    // adding a course
    const {title} = req.body;
    const course = {
        title: title,
        color: "red",
        tasks: []
    };

    const courseCollection = await courses();
    const insertInfo = await courseCollection.insertOne(course);

    if (insertInfo.insertedCount === 0) {
        throw new Error('Could not add course.');
    }

    res.json(course);

})

.route('/courses/:id')
.delete(async (req, res) => {
    // for deleting a course

    const courseCollection = await courses();
    const deletedCourse = await courseCollection.deleteOne({ _id: ObjectId(req.params.id) });
    if (deletedCourse.deletedCount === 0) {
        throw new Error(`Failed to delete course with ID ${req.params.id}.`);
    }
    
})

export default router;
