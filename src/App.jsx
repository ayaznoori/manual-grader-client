import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import "./styles/global.css";
import Register from "./components/Register";
import Home from "./pages/Home";
import SubmissionsList from "./components/SubmisionList";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/assignment/:id" element={<SubmissionsList />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
