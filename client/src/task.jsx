import './index.css'; // or wherever your Tailwind CSS file is located

const task = ({data, course, deleteTask}) => {
    return <div>
        {course && <h3 className="text-red-500">{course}</h3>}
        <p>{data.description}</p>
        <p>due: {data.due_date}</p>
        <button onClick={() => deleteTask(data.description)}>Mark Complete</button>
    </div>
}

export default task;