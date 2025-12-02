import { Login } from "./components/auth/Login";
import { Routes, Route } from "react-router-dom";
import { Signup } from "./components/auth/Signup";
import { Home } from "./pages/Home";
import PublicRoute from "./store/publicRoutes";
import Dashbord from "./pages/Dashboard";

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
    </Routes>
  );
}

export default App;
