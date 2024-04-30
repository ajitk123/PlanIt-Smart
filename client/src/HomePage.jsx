import "./index.css"; // or wherever your Tailwind CSS file is located
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failSafeModal, setFailSafeModal] = useState(false);
  const [failSafeCourseId, setFailSafeCourseId] = useState("");

  // retrieves all the courses and tasks in the same user document
  useEffect(() => {
    const fetchData = async () => {
        setTasks((await axios.get("http://localhost:3000/tasks")).data);
        setCourses((await axios.get("http://localhost:3000/courses")).data);
    };
    fetchData();
    setLoading(false);
    toast.success("successfully loaded");
  }, []);

  const addCourse = async (title) => {
    // Create a new task object
    let newCourse;
    try {
      newCourse = (
        await axios.post(`http://localhost:3000/courses`, { title: title })
      ).data;
    } catch (e) {
      toast.error(e.message);
      return;
    }

    setCourses([newCourse, ...courses]);
    toast.success("course successfully added");
  };

  const deleteCourse = async (courseId) => {
    // code here for making backend request
    try {
      const message = await axios.delete(`http://localhost:3000/courses/${courseId}`);
      console.log(`message: ${message}`);
    } catch (e) {
      toast.error(e);
      return;
    }

    setCourses(courses.filter((c) => c._id !== courseId));
    setTasks(tasks.filter((t) => t.courseId !== courseId));

    toast.success("course successfully removed");
  };

  const deleteTask = async (taskId) => {
    // code here for making backend request
    try {
      await axios.delete(`http://localhost:3000/tasks/${tasksId}`);
    } catch (e) {
      toast.error(e);
      return;
    }

    setTasks(tasks.filter((t) => t._id !== taskId));
    toast.success("assignment marked complete");
  };

  const findCouseTitleById = (courseId) => {
    return courses.find((course) => course._id === courseId).title;
  };

  if (loading) return <p>loading</p>;

  return (
    <div>
      <ToastContainer />
      <h1 className="text-center text-4xl font-bold text-primary py-4 bg-accent p-3 rounded shadow-lg">
        This Weeks Tasks
      </h1>
      <p className="text-center text-primary py-4 bg-accent">
        click on one of your courses to add assignments
      </p>
      {displayModal && (
        <AddCourseModal
          addCourse={addCourse}
          isVisible={displayModal}
          onClose={() => setDisplayModal(false)}
        />
      )}
      {failSafeModal && (
        <FailSafe
          deleteCourse={deleteCourse}
          setFailSafeModal={setFailSafeModal}
          courseId={failSafeCourseId}
        />
      )}
      <div className="grid grid-cols-7 gap-4 my-4">
        {" "}
        {/* Adjusted grid for tasks and courses */}
        {/* Task Columns for Monday to Friday */}
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
          <div key={day} className="col-span-1">
            <h2 className="text-center font-bold">{day}</h2>
            {tasks
              .filter((task) => task.day === day)
              .map((task, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-2 rounded shadow my-2"
                >
                  {task.description}
                </div>
              ))}
          </div>
        ))}
        {/* Courses Column */}
        <div className="col-span-2 bg-blue-100 p-3 rounded shadow">
          <button
            onClick={() => setDisplayModal(true)}
            className="btn btn-primary w-full mb-4"
          >
            Add Course
          </button>
          {courses.map((course) => (
            <div key={course._id} className="card card-bordered my-2">
              <div className="flex justify-between items-center p-4">
                <h2 className="card-title flex-grow">
                  <Link to={`/courses/${course._id}`}>{course.title}</Link>
                </h2>
                <button
                    onClick={() => {setFailSafeModal(true), setFailSafeCourseId(course._id)}}
                    className="btn btn-error btn-circle btn-sm"
                    title="Delete Course"
                >
                    <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AddCourseModal = ({ addCourse, isVisible, onClose }) => {
  const [courseTitle, setCourseTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a new course object
    // Invoke the provided addCourse method
    addCourse(courseTitle);
    // Clear the form
    setCourseTitle("");
    // Close modal
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`modal modal-open ${!isVisible && "modal-close"}`}>
      <div className="modal-box">
        <h2 className="font-bold text-lg mb-4">Add New Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Course Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter course name"
              className="input input-bordered w-full"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              required
            />
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Add Course
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FailSafe = ({setFailSafeModal, courseId, deleteCourse}) => {
  return <div className={`modal modal-open`}>
    <div className="modal-box">
        <h3 className="font-bold text-lg">Deleting this course will also delete the assignments associated with it. Are you sure?</h3>
        <div className="modal-action">
            <button onClick={() => {deleteCourse(courseId); setFailSafeModal(false)}} className="btn btn-error">Delete</button>
            <button onClick={() => setFailSafeModal(false)} className="btn btn-ghost">Cancel</button>
        </div>
    </div>
  </div>;
}

export default HomePage;
