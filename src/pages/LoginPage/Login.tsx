import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasCheckedToken = useRef(false);

  useEffect(() => {
    const loginWithToken = async (token: string) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/users/${token}`
        );
        const user = response.data;

        toast.success(`Welcome back, ${user.username}!`);
        setTimeout(() => {
          navigate("/dashboard", {
            state: { user },
          });
        }, 1500);
      } catch {
        console.log("Token invalid, please login again");
        localStorage.removeItem("token");
      }
    };

    // Only check token once when component mounts
    if (!hasCheckedToken.current) {
      const token = localStorage.getItem("token");
      if (token) {
        hasCheckedToken.current = true;
        loginWithToken(token);
      } else {
        hasCheckedToken.current = true;
      }
    }

    // Show success message from register
    if (location.state?.message) {
      toast.success(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, navigate]);

  const checkEmail = (email: string) => {
    if (email === "") {
      toast.error("Email cannot be empty");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    return true;
  };

  const checkPassword = (password: string) => {
    if (password === "") {
      toast.error("Password cannot be empty");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    const isEmailValid = checkEmail(email);
    const isPasswordValid = checkPassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data;
      const user = users.find(
        (u: User) => u.email === email && u.password === password
      );

      if (user) {
        // Save user ID as token
        localStorage.setItem("token", user.id.toString());

        toast.success(`Welcome back, ${user.username}!`);
        setTimeout(() => {
          navigate("/dashboard", {
            state: { user },
          });
        }, 1500);
      } else {
        toast.error("Email or password is incorrect");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log("Error logging in:", error);
      toast.error("Server error. Please try again later.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>
          <img
            src="/src/resources/Trello_icon.png"
            alt="Trello Logo"
            style={{
              width: "150px",
              height: "42.55px",
              display: "block",
              margin: "0 auto",
            }}
          />
          <p className="lablesign">Please sign in</p>
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            className="firstinput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            disabled={isSubmitting}
          />
          <input
            className="lastinput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isSubmitting}
          />

          <div style={{ textAlign: "left", marginTop: "10px" }}>
            <label>
              <input
                className="checkbox1"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting}
              />
              <span className="rememlabel">Remember me</span>
            </label>
          </div>

          <p className="register-link">
            Don't have an account?{" "}
            <a
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              click here!
            </a>
          </p>

          <button className="login-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Sign In"}
          </button>
        </form>

        <p className="copyright">© 2025 - Rikkei Education</p>
        <ToastContainer position="top-center" autoClose={2500} />
      </div>
    </div>
  );
}
