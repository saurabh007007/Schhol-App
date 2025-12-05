import { Login } from "./components/auth/Login";
import { Routes, Route } from "react-router-dom";
import { Signup } from "./components/auth/Signup";
import { Home } from "./pages/Home";
import PublicRoute from "./store/publicRoutes";
import Dashbord from "./pages/Dashboard";
import CreateStudent from "./pages/Students/createStudent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/dashboard" element={<Dashbord />} />

      <Route path="/signup" element={<Signup />} />
      {/* complete details about the student  routes here */}
      <Route path="/students/create" element={<CreateStudent />} />
    </Routes>
  );
}

export default App;
