import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
}

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkEmail = (email: string) => {
    if (email === "") {
      toast.error("Email cannot be empty");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email format is incorrect");
      return false;
    }
    return true;
  };

  const checkPassword = (password: string) => {
    if (password === "") {
      toast.error("Password cannot be empty");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecial) {
      toast.error(
        "Password must contain lowercase letters, uppercase letters, numbers and special characters"
      );
      return false;
    }
    return true;
  };

  const checkConfirmPassword = (confirmPassword: string) => {
    if (confirmPassword !== password) {
      toast.error("Password does not match");
      return false;
    }
    return true;
  };

  const checkUsername = (username: string) => {
    if (username === "") {
      toast.error("Username cannot be empty");
      return false;
    }
    if (username.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return false;
    }
    if (username.length > 20) {
      toast.error("Username must be less than 20 characters");
      return false;
    }
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      toast.error("Username can only contain letters, numbers and underscores");
      return false;
    }
    return true;
  };

  const checkUserExists = async (email: string) => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data;
      const userExists = users.find((user: User) => user.email === email);

      if (userExists) {
        toast.error("This email has already been used");
        return true;
      }
      return false;
    } catch (error) {
      console.log("Error checking user:", error);
      toast.error("Server error");
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    const isUsernameValid = checkUsername(username);
    const isEmailValid = checkEmail(email);
    const isPasswordValid = checkPassword(password);
    const isConfirmValid = checkConfirmPassword(confirmPassword);

    if (
      !isUsernameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmValid
    ) {
      return;
    }

    setIsSubmitting(true);

    const exists = await checkUserExists(email);
    if (exists) {
      setIsSubmitting(false);
      return;
    }

    try {
      const newUser = {
        username,
        email,
        password,
        created_at: new Date().toISOString(),
      };

      await axios.post("http://localhost:3000/users", newUser);

      toast.success("Registration successful! Moving to login...");

      setTimeout(() => {
        navigate("/login", {
          state: { message: "Registration successful! Please log in." },
        });
      }, 2000);

      setIsSubmitting(false);
    } catch (error) {
      console.log("Error registering:", error);
      toast.error("Registration failed, please try again later");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
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
          <p className="lablesign">Please sign up</p>
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
            className="ndinput"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            disabled={isSubmitting}
          />
          <input
            className="rdinput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isSubmitting}
          />
          <input
            className="lastinput"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            disabled={isSubmitting}
          />

          <p className="login-link">
            Already have an account,{" "}
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              click here !
            </a>
          </p>

          <button
            className="register-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="copyright">© 2025 - Rikkei Education</p>
        <ToastContainer position="top-center" autoClose={2500} />
      </div>
    </div>
  );
}
