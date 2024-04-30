import {useState, Modal, useEffect} from 'react';
import './index.css'; // or wherever your Tailwind CSS file is located
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import {useParams} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {Link} from 'react-router-dom';
import { format } from 'date-fns';


const CoursePage = () => {
    const {courseId} = useParams();
    const [tasks, setTasks] = useState([]);
    const [displayModal, setDisplayModal] = useState(false);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        // this is where I get all the tasks from a certain course
        let response = (await axios.get(`http://localhost:3000/courses/${courseId}`)).data
        setCourse(response);
        response = (await axios.get(`http://localhost:3000/tasks/${courseId}`)).data
        setTasks(response);
        setLoading(false);
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
        console.log(newTask);
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

    const completeTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:3000/tasks/${taskId}`);
          } catch(e) {
            toast.error(e);
            return;
        }

        setTasks(() => tasks.filter((task) => task._id !== taskId));
        // make backend request here
        toast.success("assignment marked complete");
    }

    if (loading) 
        return <></>;
    
    else return <>
        <ToastContainer />
        <div className="container mx-auto px-2 py-2">
            <div className="flex items-center justify-between mb-4">
            {/* Back and Add Task Buttons */}
            <div className="flex items-center gap-4">
            {/* Back Button */}
            <Link to="/" className="btn btn-outline btn-accent">
                <i className="fas fa-arrow-left"></i> Back
            </Link>

            {/* Task Modal Trigger */}
            <button className="btn btn-primary" onClick={() => setDisplayModal(true)}>
                Add Task
            </button>
            </div>
            
            {/* Course Title */}
            <h2 className="text-xl font-bold flex-grow text-center">{course.title}</h2>
            
            {/* Spacer to balance the layout */}
            <div style={{ width: 144 }}> {/* Adjust width based on actual button widths to balance */}
        </div>
        
        </div>

            {/* TaskModal Component */}
            {displayModal && (
                <>
                <TaskModal
                    isVisible={displayModal}
                    onClose={() => setDisplayModal(false)}
                    addTask={addTask}
                />
                </>
            )}
        </div>

        <div className="col-span-2 bg-blue-100 p-3 rounded shadow">
  <div className="grid grid-cols-2 gap-4 place-items-center mx-auto"> {/* Updated grid setup for centering */}
    {tasks && tasks.map(task => (
      <div key={task._id} className="card card-bordered my-2 w-full"> {/* Ensure full width of grid column */}
        <div className="flex justify-between items-center p-4">
          <div className="flex-grow">
            <h2 className="card-title">{task.description}</h2>
            <p className="text-sm text-gray-600">Due: {task.due_date}</p>
          </div>
          <button
            onClick={() => completeTask(task._id)}
            className="btn btn-success btn-circle btn-sm"
            title="Mark Complete"
          >
            <i className="fas fa-check"></i>
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

    </>
}

const TaskModal = ({ isVisible, onClose, addTask }) => {
    const [description, setDescription] = useState('');
    const [due_date, setDueDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        
        if (description && due_date) {
            const date = new Date(due_date);
        const adjustedDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));

            addTask({ description, due_date: format(new Date(adjustedDate), 'MM/dd/yyyy') });
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
                        id="due_date"
                        className="input input-bordered w-full"
                        value={due_date}
                        min={getTodayString()}
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

const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // getMonth() returns month from 0-11
    const day = today.getDate();
    // Format the date into YYYY-MM-DD
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};



export default CoursePage;