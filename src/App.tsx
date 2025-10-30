import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import Register from "./pages/RegisterPage/Register";
import Login from "./pages/LoginPage/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Board from "./pages/Boards/Boards";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Default page - Register (shows directly on homepage) */}
          <Route path="/" element={<Register />} />

          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard page*/}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Board page*/}
          <Route path="/board" element={<Board />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
