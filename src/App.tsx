import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage/Register";
import Login from "./pages/LoginPage/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default page - Register (shows directly on homepage) */}
        <Route path="/" element={<Register />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard page*/}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
