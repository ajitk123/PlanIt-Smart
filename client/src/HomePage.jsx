import './index.css'; // or wherever your Tailwind CSS file is located
import {
    Navigate,
    useNavigate,
    Link,
} from "react-router-dom";
import {useState} from 'react';

const HomePage = () => {

    const [courses, setCourses] = useState([]);
    const [displayModal, setDisplayModal] = useState(false);
    
    const addCourse = (course) => {
      setCourses([course, ...courses])
    }

    const deleteCourse = (course) => {
      setCourses(courses.filter(c => c !== course));
    }

    return <div>
        <h1>Plan-It Smart</h1>
        {displayModal && (<AddCourseModal
                addCourse={addCourse}
                isVisible={displayModal}
                onClose={() => setDisplayModal(false)}
            />)}
        <button onClick={() => setDisplayModal(true)}>add course</button>
        <div className="grid grid-cols-3 gap-4"> {/* Layout courses in a grid */}
            {courses.map((course) => (
                <div key={course.id} className="card card-bordered" >
                    <div className="card-body">
                        <Link to={`/courses/${course.id}`}><h2 className="card-title">{course.name}</h2></Link>
                        <button 
                            onClick={() => deleteCourse(course.id)} 
                            className="btn btn-error btn-circle btn-sm absolute right-2 top-2">
                            <i className="fas fa-trash-alt"></i> {/* Font Awesome trash icon */}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
}



const AddCourseModal = ({ addCourse, isVisible, onClose }) => {
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Create a new course object
      const newCourse = {
        name: courseName,
        description: courseDescription,
      };
      // Invoke the provided addCourse method
      addCourse(newCourse);
      // Clear the form
      setCourseName('');
      setCourseDescription('');
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
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Add Course</button>
              <button type="button" className="btn" onClick={onClose}>Close</button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default HomePage;