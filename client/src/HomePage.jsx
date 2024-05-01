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


  const [monday, setMonday] = useState([]);
  const [tuesday, setTuesday] = useState([]);
  const [wednesday, setWednesday] = useState([]);
  const [thursday, setThursday] = useState([]);
  const [friday, setFriday] = useState([]);

  const parseDate = (dateStr) => {
    const [month, day, year] = dateStr.split("/");
    return new Date(year, month - 1, day); // Note: Months are 0-indexed in JavaScript Date
  };

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for comparison
    const currentDayIndex = today.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
  
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const dayOffsets = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5 };
  
    // Create arrays for each day
    const mondayTasks = [];
    const tuesdayTasks = [];
    const wednesdayTasks = [];
    const thursdayTasks = [];
    const fridayTasks = [];
  
    tasks.forEach(task => {
      const taskDate = parseDate(task.due_date);
      taskDate.setHours(0, 0, 0, 0); // Normalize task date to midnight for comparison
      const taskDayOfWeek = taskDate.getDay();
  
      if (taskDayOfWeek === dayOffsets.Monday && taskDate >= today) {
        mondayTasks.push(task);
      } else if (taskDayOfWeek === dayOffsets.Tuesday && taskDate >= today) {
        tuesdayTasks.push(task);
      } else if (taskDayOfWeek === dayOffsets.Wednesday && taskDate >= today) {
        wednesdayTasks.push(task);
      } else if (taskDayOfWeek === dayOffsets.Thursday && taskDate >= today) {
        thursdayTasks.push(task);
      } else if (taskDayOfWeek === dayOffsets.Friday && taskDate >= today) {
        fridayTasks.push(task);
      }
    });

    // Update state based on current day to filter past days
    setMonday(currentDayIndex <= dayOffsets.Monday ? mondayTasks : []);
    setTuesday(currentDayIndex <= dayOffsets.Tuesday ? tuesdayTasks : []);
    setWednesday(currentDayIndex <= dayOffsets.Wednesday ? wednesdayTasks : []);
    setThursday(currentDayIndex <= dayOffsets.Thursday ? thursdayTasks : []);
    setFriday(currentDayIndex <= dayOffsets.Friday ? fridayTasks : []);
  }, [tasks, courses]); // You might include courses in dependencies if they affect the rendering logic
  

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

  const completeTask = async (taskId) => {
    // code here for making backend request
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
    } catch (e) {
      toast.error(e.message);
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
        <div className="col-span-5">
        <TasksDisplayComponent
          monday={monday}
          tuesday={tuesday}
          wednesday={wednesday}
          thursday={thursday}
          friday={friday}
          completeTask={completeTask}
        />
        </div>
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

const TasksDisplayComponent = ({ monday, tuesday, wednesday, thursday, friday, completeTask }) => {
  // Create a mapping from day names to their corresponding state variables
  const dayToTasksMapping = {
    Monday: monday,
    Tuesday: tuesday,
    Wednesday: wednesday,
    Thursday: thursday,
    Friday: friday
  };

  return (
    <div className="grid grid-cols-5 gap-4 my-4"> {/* Adjust grid cols to 5 for 5 days */}
      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
        <div key={day} className="col-span-1">
          <h2 className="text-center font-bold">{day}</h2>
          {dayToTasksMapping[day].map((task, index) => (
            <div
              key={index}
              className="bg-gray-100 p-2 rounded shadow my-2"
            > 
              <strong>{task.course_title}</strong>
              <p className="my-4">{task.description}</p>
              <button
                onClick={() => completeTask(task._id)}
                className="btn btn-success btn-circle btn-sm"
                title="Mark Complete"
              >
                <i className="fas fa-check"></i>
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HomePage;
