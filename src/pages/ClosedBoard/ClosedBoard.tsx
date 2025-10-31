import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../../stores/hook";
import { setBoards, deleteBoard } from "../../stores/boardSlice";
import axios from "axios";
import ConfirmDeleteModal from "../Boards/Modal/ConfirmDeleteModal";
import "../Dashboard/Dashboard.css";

// ========================================
// DATA TYPES
// ========================================
interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface List {
  id: string;
  title: string;
  tasks: Task[];
}

interface Board {
  id: string;
  title: string;
  background: string;
  backgroundType: "image" | "color";
  isStarred: boolean;
  isClosed: boolean;
  createdAt: string;
  lists: List[];
}

interface User {
  id: string;
  boards: Board[];
}

// ========================================
// MAIN COMPONENT
// ========================================
export default function ClosedBoards() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get boards from Redux
  const boards = useAppSelector((state) => state.boards.boards);

  // User and loading state
  const [user, setUser] = useState<User | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);

  // Filter closed boards
  const closedBoards = boards.filter((b) => b.isClosed);

  // ========================================
  // LOAD DATA WHEN PAGE OPENS
  // ========================================
  useEffect(() => {
    const loadUserFromServer = async (token: string) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/users/${token}`
        );
        setUser(response.data);
        dispatch(setBoards(response.data.boards || []));
        setIsFirstLoad(false);
      } catch {
        toast.error("Could not load your data");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadUserFromServer(token);
  }, [navigate, dispatch]);

  // ========================================
  // AUTO-SAVE TO SERVER
  // ========================================
  useEffect(() => {
    const saveToServer = async (updatedBoards: Board[]) => {
      if (!user) return;
      try {
        await axios.patch(`http://localhost:3000/users/${user.id}`, {
          boards: updatedBoards,
        });
      } catch {
        toast.error("Could not save changes");
      }
    };

    if (!isFirstLoad && user) {
      saveToServer(boards);
    }
  }, [boards, isFirstLoad, user]);

  // ========================================
  // LOGOUT
  // ========================================
  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out!");
    setTimeout(() => navigate("/login"), 1000);
  };

  // ========================================
  // DELETE BOARD PERMANENTLY
  // ========================================
  const deleteBoardPermanently = () => {
    if (!boardToDelete) return;

    dispatch(deleteBoard(boardToDelete));
    setBoardToDelete(null);
    toast.success("Board deleted permanently!");
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div>
      {/* Top Bar */}
      <div className="navbar">
        <div
          className="navbar-logo"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <img src="/src/resources/Trello_DashboardLogo.png" alt="Trello" />
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Left Side Menu */}
        <div className="sidebar">
          <h3 className="workspaceh3">YOUR WORKSPACES</h3>

          <div className="sidebar-item" onClick={() => navigate("/dashboard")}>
            <img src="/src/resources/Sidebar_Menu.png" alt="" /> Boards
          </div>
          <div className="sidebar-item" onClick={() => navigate("/dashboard")}>
            <img src="/src/resources/Sidebar_Star.png" alt="" /> Starred Boards
          </div>
          <div className="sidebar-item active">
            <img src="/src/resources/Sidebar_Closed.png" alt="" /> Closed Boards
          </div>

          <div className="sidebar-divider"></div>

          <div className="sidebar-item">
            <img src="/src/resources/Sidebar_Setting.png" alt="" /> Settings
          </div>
          <div className="sidebar-item" onClick={logout}>
            <img src="/src/resources/Sidebar_LogOut.png" alt="" /> Sign out
          </div>

          <div className="sidebar-divider"></div>

          <div className="your-boards-section">
            <h4>Your boards</h4>
            <button className="add-board-btn">+</button>
          </div>

          {/* Show all boards */}
          {boards
            .filter((b) => !b.isClosed)
            .map((board) => (
              <div
                key={board.id}
                className="sidebar-board-item"
                onClick={() => navigate("/dashboard")}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="board-thumbnail"
                  style={{
                    background:
                      board.backgroundType === "color"
                        ? board.background
                        : `url(${board.background})`,
                  }}
                ></div>
                <span>{board.title}</span>
              </div>
            ))}
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Section Header */}
          <div className="section-header">
            <span className="section-icon">
              <img src="/src/resources/Sidebar_Closed.png" alt="Closed" />
            </span>
            <h2 className="workspace">Closed Boards</h2>
          </div>
          <hr className="section-divider" />

          {/* Closed Boards Grid */}
          {closedBoards.length === 0 ? (
            <div
              style={{ padding: "40px", textAlign: "center", color: "#666" }}
            >
              <p>No closed boards yet.</p>
            </div>
          ) : (
            <div className="board-grid">
              {closedBoards.map((board) => (
                <div
                  key={board.id}
                  className="board-card"
                  style={{
                    background:
                      board.backgroundType === "color"
                        ? board.background
                        : `url(${board.background})`,
                    backgroundColor:
                      board.backgroundType === "color"
                        ? board.background
                        : undefined,
                    opacity: 0.7,
                  }}
                >
                  <div className="board-card-title">{board.title}</div>

                  <div className="board-card-actions">
                    <button
                      className="board-edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBoardToDelete(board.id);
                      }}
                      style={{ background: "#eb5a46" }}
                    >
                      <span className="edit-icon">✕</span>{" "}
                      <span style={{ fontSize: "12px" }}>
                        Delete permanently
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Board Confirmation */}
      {boardToDelete && (
        <ConfirmDeleteModal
          title="Are you sure?"
          message="Delete this board permenantly."
          onConfirm={deleteBoardPermanently}
          onClose={() => setBoardToDelete(null)}
        />
      )}

      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
}
