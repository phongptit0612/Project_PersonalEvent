import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";
import NewBoardModal from "./Modal/NewBoardModal";

// ========================
// Types
// ========================
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  boards?: Board[];
}

interface Board {
  id: string;
  title: string;
  background: string;
  backgroundType: "image" | "color";
  isStarred: boolean;
  isClosed: boolean;
  createdAt: string;
}

// ========================
// Component
// ========================
export default function Dashboard() {
  const navigate = useNavigate();

  // ---------- States ----------
  const [user, setUser] = useState<User | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [deletingBoard, setDeletingBoard] = useState<Board | null>(null);

  // ---------- Effects ----------
  // When the page loads, check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadUserData(token);
  }, [navigate]);

  // ---------- API Functions ----------
  const loadUserData = async (token: string) => {
    try {
      const res = await axios.get(`http://localhost:3000/users/${token}`);
      setUser(res.data);
      setBoards(res.data.boards || []);
    } catch {
      toast.error("Failed to load user data");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const updateBoardsOnServer = async (updatedBoards: Board[]) => {
    if (!user) return;
    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        boards: updatedBoards,
      });
    } catch {
      toast.error("Failed to update board");
      const token = localStorage.getItem("token");
      if (token) loadUserData(token);
    }
  };

  // ---------- Board Handlers ----------
  const handleCreateBoard = async (
    boardData: Omit<Board, "id" | "createdAt">
  ) => {
    const newBoard: Board = {
      ...boardData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedBoards = [...boards, newBoard];
    setBoards(updatedBoards);
    await updateBoardsOnServer(updatedBoards);
    toast.success("Board created successfully!");
    setShowModal(false);
  };

  const handleEditBoard = async (
    boardData: Omit<Board, "id" | "createdAt">
  ) => {
    if (!editingBoard) return;

    const updatedBoards = boards.map((b) =>
      b.id === editingBoard.id ? { ...b, ...boardData } : b
    );

    setBoards(updatedBoards);
    await updateBoardsOnServer(updatedBoards);
    toast.success("Board updated successfully!");
    setEditingBoard(null);
  };

  const handleDeleteBoard = async () => {
    if (!deletingBoard) return;

    const updatedBoards = boards.filter((b) => b.id !== deletingBoard.id);
    setBoards(updatedBoards);
    await updateBoardsOnServer(updatedBoards);
    toast.success("Board deleted successfully!");
    setDeletingBoard(null);
  };

  const toggleStarBoard = async (boardId: string) => {
    const updatedBoards = boards.map((b) =>
      b.id === boardId ? { ...b, isStarred: !b.isStarred } : b
    );
    setBoards(updatedBoards);
    await updateBoardsOnServer(updatedBoards);
  };

  // ---------- Logout ----------
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    setTimeout(() => navigate("/login"), 1000);
  };

  // ---------- Filter Boards ----------
  const starredBoards = boards.filter((b) => b.isStarred && !b.isClosed);
  const workspaceBoards = boards.filter((b) => !b.isClosed);

  // ---------- Helper Component for Board Card ----------
  const BoardCard = ({ board }: { board: Board }) => (
    <div
      key={board.id}
      className="board-card"
      style={{
        background:
          board.backgroundType === "color"
            ? board.background
            : `url(${board.background})`,
        backgroundColor:
          board.backgroundType === "color" ? board.background : undefined,
      }}
    >
      <div className="board-card-title">{board.title}</div>

      <div className="board-card-actions">
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
  );

  // ---------- Render ----------
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
          <h3 className="workspaceh3">YOUR WORKSPACES</h3>

          <div className="sidebar-item">
            <img src="/src/resources/Sidebar_Menu.png" alt="" /> Boards
          </div>
          <div className="sidebar-item">
            <img src="/src/resources/Sidebar_Star.png" alt="" /> Starred Boards
          </div>
          <div className="sidebar-item">
            <img src="/src/resources/Sidebar_Closed.png" alt="" /> Closed Boards
          </div>

          <div className="sidebar-divider"></div>

          <div className="sidebar-item">
            <img src="/src/resources/Sidebar_Setting.png" alt="" /> Settings
          </div>
          <div className="sidebar-item" onClick={handleLogout}>
            <img src="/src/resources/Sidebar_LogOut.png" alt="" /> Sign out
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Workspaces Section */}
          <div className="section-header">
            <span className="section-icon">
              <img
                className="icon1"
                src="/src/resources/menu1.png"
                alt="Menu"
              />
            </span>
            <h2 className="workspace">Your Workspaces</h2>
          </div>
          <hr className="section-divider" />

          <div className="board-grid">
            {/* Create New Board */}
            <div
              className="create-board-card"
              onClick={() => setShowModal(true)}
            >
              <span>+ Create new board</span>
            </div>

            {/* Show Workspace Boards */}
            {workspaceBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>

          {/* Starred Boards Section */}
          <div className="section-header" style={{ marginTop: "40px" }}>
            <span className="section-icon">⭐</span>
            <h2>Starred Boards</h2>
          </div>
          <hr className="section-divider" />

          {starredBoards.length > 0 && (
            <div className="board-grid">
              {starredBoards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          )}
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

      {/* Delete Confirmation */}
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
