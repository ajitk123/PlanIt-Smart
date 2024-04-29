import { courses, tasks } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';

/* each course has tasks(assignments). When you make a new course, you set the tasks to an empty array
* don't worry about the color i'll deal with that
* the course object should have the course title, which is inputted
*/

let courseDataFunctions = {
    async addCourse(title) {
        const course = {
            title: title,
            color: "red", // i'm hardcoding this for now but i'll change it later
            tasks: []
        };

        const courseCollection = await courses();
        
        // finish the rest of this

        const insertInfo = await courseCollection.insertOne(course);
        if (insertInfo.insertedCount === 0) {
            throw new Error('Could not add course.');
        }

    },
    async addTaskToCourse(description, due_date, courseId) {

        //tasks will have courseId as a field
        const task = {
            description: description,
            due_date: due_date,
            course_title: "", //name will be set later
            course_color: "", //color can be set later
            courseId: courseId
        };

        const taskCollection = await tasks();
        
        const insertInfo = await taskCollection.insertOne(task);
        if (insertInfo.insertedCount === 0) {
            throw new Error('Could not add task.');
        }
    },

    /*
    date --> formatted date string i.e. MM/DD/YYYY
    get all the tasks from ALL courses whose due_dates are same as the input
     */

    async getAllCourses() {

        //return all courses in collection
        const courseCollection = await courses();
        const allCourses = await courseCollection.find({}).toArray();
        return allCourses;

    },


    async getAllTasks() {

        //return all tasks in collection
        const taskCollection = await tasks();
        const allTasks = await taskCollection.find({}).toArray();
        return allTasks;
        
    }, 

    /* gets all the tasks from a single course */
    async getAllTasksFromCourse(courseId) {

        const taskCollection = await tasks();
        //tasks will have courseId as a field

        const tasks = await taskCollection.find({ courseId: courseId }).toArray();
        return tasks;

    },

    // deletes a course
    async deleteCourse(courseId) {

        const courseCollection = await courses();
        const deletedCourse = await courseCollection.deleteOne({ _id: ObjectId(courseId) });

        if (deletedCourse.deletedCount === 0) {
            throw new Error(`Failed to delete course with ID ${courseId}.`);
        }

    },
    
    // deletes a specific task
    async deleteTask(courseId, taskId) {

        const courseCollection = await courses();
        const updatedCourse = await courseCollection.updateOne(
            { _id: ObjectId(courseId) },
            { $pull: { tasks: { _id: ObjectId(taskId) } } }
        );

        if (updatedCourse.modifiedCount === 0) {
            throw new Error(`Failed to delete task with ID ${taskId} from course with ID ${courseId}.`);
        }

    }
}

export default courseDataFunctions;
