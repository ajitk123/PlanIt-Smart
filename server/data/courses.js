import { courses } from '../config/mongoCollections.js'
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
    },
    async addTaskToCourse(description, due_date, courseId) {
        // adds a task to a course
        /* the tasks is a subdocument for the courses collection
        This is what the task subdocument looks like:
        task {
            description (string),
            due_date (formatted date i.e. MM/DD/YYYY)
            course_title (I know this is redudant but it makes it easier)
            course_color (also redudant but it's useful)
        }
        */
    },
    /*
    date --> formatted date string i.e. MM/DD/YYYY
    get all the tasks from ALL courses whose due_dates are same as the input
     */
    async getAllTasksByDate(date) {
        
    }, 
    /* gets all the tasks from a single course */
    async getAllTasksFromCourse(courseId) {

    },
    // deletes a course
    async deleteCourse(courseId) {

    },
    // deletes a specific task
    async deleteTask(courseId, taskId) {

    }
}

export default courseDataFunctions;