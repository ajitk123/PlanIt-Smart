import Task from './task.jsx';
import {useState, Modal, useEffect} from 'react';
import './index.css'; // or wherever your Tailwind CSS file is located
import axios from 'axios';
import { toast } from "react-toastify";

const CoursePage = () => {
    const courseId = useParams();
    const [tasks, setTasks] = useState([]);
    const [displayModal, setDisplayModal] = useState(false);
    let course;

    useEffect(() => {
        // this is where I get all the tasks from a certain course
        course = null // make backend request to get course object
    }, []);
    
    const addTask = async ({ description, due_date }) => {
        // Create a new task object
        let newTask;
        try {
            newTask = (await axios.post(`http://localhost:3000/tasks`, { 
            description: description, 
            courseId: courseId, 
            due_date: due_date 
        })).data;
        } catch(e) {
            toast.error(e);
            return;
        }

        // Add the new task to the existing tasks array and sort it
        setTasks(prevTasks => {
            // Concatenates the new task to the previous tasks array
            const updatedTasks = [...prevTasks, newTask];

            // Sorts the tasks array by due date, converting dates to timestamps
            updatedTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

            return updatedTasks;
        });
        toast.success("assignment successfully created");
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:3000/tasks/${tasksId}`);
          } catch(e) {
            toast.error(e);
            return;
        }

        setTasks(() => tasks.filter((task) => task._id !== taskId));
        // make backend request here
        toast.success("assignment marked complete");
    }
    
    return <>
        <h2>{course.title}</h2>
        {displayModal && <>
            <TaskModal
                    isVisible={displayModal}
                    onClose={() => setDisplayModal(false)}
                    addTask={addTask}
            />
        </>}
        <button className="" onClick={() => setDisplayModal(true)}>
            add task
        </button>
        {tasks && <div>
            {tasks.map(data => <Task data={data} deleteTask={deleteTask}/>)}
        </div>}
    </>
}

const TaskModal = ({ isVisible, onClose, addTask }) => {
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (description && dueDate) {
            addTask({ description, dueDate });
            setDescription('');
            setDueDate('');
            onClose();
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`modal modal-open ${!isVisible ? "modal-close" : ""}`}>
            <div className="modal-box">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="description" className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <input
                        type="text"
                        id="description"
                        className="input input-bordered w-full"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <label htmlFor="dueDate" className="label">
                        <span className="label-text">Due Date</span>
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        className="input input-bordered w-full"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />

                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary">Add Task</button>
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};



export default CoursePage;