import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./components/auth/Login";
function App() {


  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<div>Signup</div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
