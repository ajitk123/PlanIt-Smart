import { courses, tasks } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';

let courseDataFunctions = {
    async addCourse(title) {
        const course = {
            _id: new ObjectId(),
            title: title,
            color: "red", // i'm hardcoding this for now but i'll change it later
        };

        const courseCollection = await courses();
        
        // finish the rest of this

        const insertInfo = await courseCollection.insertOne(course);
        if (insertInfo.insertedCount === 0) {
            throw new Error('Could not add course.');
        }

        course._id = course._id.toString();
        return course;

    },
    async addTaskToCourse(description, courseId, due_date, course_title) {

        //tasks will have courseId as a field
        const task = {
            _id: new ObjectId(),
            description: description,
            due_date: due_date,
            courseId: courseId,
            course_title: course_title
        };

        const taskCollection = await tasks();
        
        const insertInfo = await taskCollection.insertOne(task);
        if (insertInfo.insertedCount === 0) {
            throw new Error('Could not add task.');
        }

        task._id = task._id.toString();
        return task;
    },

    async getCourseById(courseId) {
        const courseCollection = await courses();
        const course = await courseCollection.findOne({ _id: new ObjectId(courseId) });
        course._id = course._id.toString();
        return course;
    },

    /*
    date --> formatted date string i.e. MM/DD/YYYY
    get all the tasks from ALL courses whose due_dates are same as the input
     */

    async getAllCourses() {

        //return all courses in collection
        const courseCollection = await courses();
        const allCourses = await courseCollection.find({}).toArray();
        
        const output = allCourses.map((course) => {
            course._id = course._id.toString();
            return course;
        });
        return output;

    },


    async getAllTasks() {

        //return all tasks in collection
        const taskCollection = await tasks();
        const allTasks = await taskCollection.find({}).toArray();

        const output = allTasks.map((task) => {
            task._id = task._id.toString();
            return task;
        });
        return output;
        
    }, 

    /* gets all the tasks from a single course */
    async getAllTasksFromCourse(courseId) {

    

        let tasks = (await this.getAllTasks()).filter((task) => task.courseId === courseId);

        const output = tasks.map(task => {
            task._id = task._id.toString()
            return task;
        })
        return output;

    },

    // deletes a course
    async deleteCourse(courseId) {
        const courseCollection = await courses();
        const deletedCourse = await courseCollection.deleteOne({ _id: new ObjectId(courseId) });
        const taskCollection = await tasks();
        await taskCollection.deleteMany({courseId: courseId})
    },
    
    // deletes a specific task
    async deleteTask(taskId) {
        if(!ObjectId.isValid(taskId)) throw "Error: invalid ID";
        const taskCollection = await tasks();
        const deletedTask = await taskCollection.deleteOne({ _id: new ObjectId(taskId) });
    }
}

export default courseDataFunctions;
