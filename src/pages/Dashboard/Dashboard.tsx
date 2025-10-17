import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";
import NewBoardModal from "./Modal/NewBoardModal";

// User structure
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  boards?: Board[];
}

// Board structure
interface Board {
  id: string;
  title: string;
  background: string;
  backgroundType: "image" | "color";
  isStarred: boolean;
  isClosed: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();

  // States
  const [user, setUser] = useState<User | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [filteredBoards, setFilteredBoards] = useState<Board[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [deletingBoard, setDeletingBoard] = useState<Board | null>(null);

  // Check if user is logged in when page loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadUserData(token);
  }, [navigate]);

  // Filter boards whenever filter or boards change
  useEffect(() => {
    filterBoards();
  }, [activeFilter, boards]);

  // Load user data from server
  const loadUserData = async (token: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${token}`);
      setUser(response.data);
      setBoards(response.data.boards || []);
    } catch (error) {
      toast.error("Failed to load user data");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // Filter boards based on selected tab
  const filterBoards = () => {
    if (activeFilter === "all") {
      setFilteredBoards(boards.filter((b) => !b.isClosed));
    } else if (activeFilter === "starred") {
      setFilteredBoards(boards.filter((b) => b.isStarred && !b.isClosed));
    } else if (activeFilter === "closed") {
      setFilteredBoards(boards.filter((b) => b.isClosed));
    }
  };

  // Create new board
  const handleCreateBoard = async (
    boardData: Omit<Board, "id" | "createdAt">
  ) => {
    if (!user) return;

    const newBoard: Board = {
      ...boardData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        boards: updatedBoards,
      });
      toast.success("Board created successfully!");
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to create board");
      setBoards(boards);
    }
  };

  // Edit existing board
  const handleEditBoard = async (
    boardData: Omit<Board, "id" | "createdAt">
  ) => {
    if (!user || !editingBoard) return;

    const updatedBoards = boards.map((b) =>
      b.id === editingBoard.id ? { ...b, ...boardData } : b
    );
    setBoards(updatedBoards);

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        boards: updatedBoards,
      });
      toast.success("Board updated successfully!");
      setEditingBoard(null);
    } catch (error) {
      toast.error("Failed to update board");
      setBoards(boards);
    }
  };

  // Delete board
  const handleDeleteBoard = async () => {
    if (!user || !deletingBoard) return;

    const updatedBoards = boards.filter((b) => b.id !== deletingBoard.id);
    setBoards(updatedBoards);

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        boards: updatedBoards,
      });
      toast.success("Board deleted successfully!");
      setDeletingBoard(null);
    } catch (error) {
      toast.error("Failed to delete board");
      setBoards(boards);
    }
  };

  // Star/Unstar board
  const toggleStarBoard = async (boardId: string) => {
    if (!user) return;

    const updatedBoards = boards.map((b) =>
      b.id === boardId ? { ...b, isStarred: !b.isStarred } : b
    );
    setBoards(updatedBoards);

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        boards: updatedBoards,
      });
    } catch (error) {
      setBoards(boards);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-logo">
          <img src="/src/resources/Trello_DashboardLogo.png" alt="Trello" />
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>YOUR WORKSPACES</h3>

          <div className="sidebar-item" onClick={() => setActiveFilter("all")}>
            📊 Boards
          </div>
          <div
            className="sidebar-item"
            onClick={() => setActiveFilter("starred")}
          >
            ⭐ Starred Boards
          </div>
          <div
            className="sidebar-item"
            onClick={() => setActiveFilter("closed")}
          >
            🗑️ Closed Boards
          </div>

          <div className="sidebar-divider"></div>

          <div className="sidebar-item">⚙️ Settings</div>
          <div className="sidebar-item" onClick={handleLogout}>
            🚪 Sign out
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="section-header">
            {activeFilter === "all" && (
              <>
                <span className="section-icon">
                  <img
                    className="icon1"
                    src="/src/resources/menu1.png"
                    alt="Menu"
                  />
                </span>
                <h2 className="workspace">Your Workspaces</h2>
              </>
            )}

            {activeFilter === "starred" && (
              <>
                <span className="section-icon">⭐</span>
                <h2>Starred Boards</h2>
              </>
            )}

            {activeFilter === "closed" && (
              <>
                <span className="section-icon">🗑️</span>
                <h2>Closed Boards</h2>
              </>
            )}
          </div>
          {/* ✨ New Section: Starred Boards */}
          <div className="section-header" style={{ marginTop: "40px" }}>
            <span className="section-icon">⭐</span>
            <h2>Starred Boards</h2>
          </div>
          {/* Boards Grid */}
          <div className="board-grid">
            {activeFilter !== "closed" && (
              <div
                className="create-board-card"
                onClick={() => setShowModal(true)}
              >
                <span>+ Create new board</span>
              </div>
            )}

            {filteredBoards.map((board) => (
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
                }}
              >
                <div className="board-card-title">{board.title}</div>

                <div className="board-card-actions">
                  {!board.isClosed && (
                    <>
                      <button
                        className="board-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStarBoard(board.id);
                        }}
                      >
                        {board.isStarred ? "★" : "☆"}
                      </button>
                      <button
                        className="board-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBoard(board);
                        }}
                      >
                        Edit
                      </button>
                    </>
                  )}
                  <button
                    className="board-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingBoard(board);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {(showModal || editingBoard) && (
        <NewBoardModal
          isEdit={!!editingBoard}
          initialData={editingBoard || undefined}
          onSave={editingBoard ? handleEditBoard : handleCreateBoard}
          onClose={() => {
            setShowModal(false);
            setEditingBoard(null);
          }}
        />
      )}

      {deletingBoard && (
        <div className="modal-overlay" onClick={() => setDeletingBoard(null)}>
          <div
            className="modal-content confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button
                className="modal-close"
                onClick={() => setDeletingBoard(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to delete "{deletingBoard.title}"?
                <br />
                This action cannot be undone.
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-cancel"
                onClick={() => setDeletingBoard(null)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleDeleteBoard}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
}
