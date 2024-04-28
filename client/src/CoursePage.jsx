import Task from './task.jsx';
import {useState, Modal, useEffect} from 'react';
import './index.css'; // or wherever your Tailwind CSS file is located

const CoursePage = () => {
    const course = useParams();
    const [tasks, setTasks] = useState([]);
    const [displayModal, setDisplayModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            
        };

        fetchData();
    }, [course]);

    
    const addTask = ({ description, due_date }) => {
        // Create a new task object
        const newTask = { description, due_date: new Date(due_date) };

        // Add the new task to the existing tasks array and sort it
        setTasks(prevTasks => {
            // Concatenates the new task to the previous tasks array
            const updatedTasks = [...prevTasks, newTask];

            // Sorts the tasks array by due date, converting dates to timestamps
            updatedTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

            return updatedTasks;
        });

        
    };

    const deleteTodo = (description) => {
        setTasks(() => tasks.filter((task) => task.description !== description));
        
    }
    
    useEffect(() => console.log(displayModal), [displayModal]);
    
    return <>
        <h2 className="text-red-500">{course}</h2>
        {displayModal && <>
            <dialog id="my_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">Press ESC key or click outside to close</p>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={() => setDisplayModal(false)}>close</button>
            </form>
            </dialog>
        </>
        }
        <button className="" onClick={() => setDisplayModal(true)}>
            add task
        </button>
        {tasks && <div>
            {tasks.map(data => <Task data={data} deleteTask={deleteTask}/>)}
        </div>}
    </>
}

export default CoursePage;