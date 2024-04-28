import CoursePage from './CoursePage.jsx';
import './index.css'; // or wherever your Tailwind CSS file is located
import {
    Route,
    Routes,
    BrowserRouter as Router,
    Navigate,
    useNavigate,
} from "react-router-dom";
import HomePage from './HomePage.jsx';

const App = () => {
    return (
        <Routes>
          <Route
            path="/"
            element={<HomePage/>}
          />
          <Route path="/courses/:course" element={<CoursePage/>}/>
        </Routes>
    );
}

export default App