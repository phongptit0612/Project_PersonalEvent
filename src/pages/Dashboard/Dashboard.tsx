import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";
import NewBoardModal from "./Modal/NewBoardModal";
import { useAppDispatch, useAppSelector } from "../../stores/hook";
import {
  setBoards,
  addBoard,
  updateBoard,
  setCurrentBoardId,
} from "../../stores/boardSlice";

// Types
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  boards?: Board[];
}

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

// Component
export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get boards from Redux store instead of local state
  const boards = useAppSelector((state) => state.boards.boards);

  // ---------- States ----------
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  // ---------- API Functions ----------
  const loadUserData = useCallback(
    async (token: string) => {
      try {
        const res = await axios.get(`http://localhost:3000/users/${token}`);
        setUser(res.data);

        // Ensure all boards have lists array
        const boardsWithLists = (res.data.boards || []).map((board: Board) => ({
          ...board,
          lists: board.lists || [],
        }));

        // Update Redux with boards from server
        dispatch(setBoards(boardsWithLists));
      } catch {
        toast.error("Failed to load user data");
        localStorage.removeItem("token");
        navigate("/login");
      }
    },
    [dispatch, navigate]
  );

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

  // ---------- Effects ----------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    loadUserData(token);
  }, [navigate, loadUserData]);

  // ---------- Board Handlers ----------
  const handleCreateBoard = async (
    boardData: Omit<Board, "id" | "createdAt" | "lists">
  ) => {
    const newBoard: Board = {
      ...boardData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lists: [], // Initialize with empty lists
    };

    // 1. Update Redux first
    dispatch(addBoard(newBoard));

    // 2. Update server
    const updatedBoards = [...boards, newBoard];
    await updateBoardsOnServer(updatedBoards);

    toast.success("Board created successfully!");
    setShowModal(false);
  };

  const handleEditBoard = async (
    boardData: Omit<Board, "id" | "createdAt" | "lists">
  ) => {
    if (!editingBoard) return;

    const updatedBoard: Board = {
      ...editingBoard,
      ...boardData,
    };

    // 1. Update Redux first
    dispatch(updateBoard(updatedBoard));

    // 2. Update server
    const updatedBoards = boards.map((b) =>
      b.id === editingBoard.id ? updatedBoard : b
    );
    await updateBoardsOnServer(updatedBoards);

    toast.success("Board updated successfully!");
    setEditingBoard(null);
  };

  const handleBoardClick = (boardId: string) => {
    dispatch(setCurrentBoardId(boardId));
    navigate("/board");
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
        cursor: "pointer",
      }}
      onClick={() => handleBoardClick(board.id)}
    >
      <div className="board-card-title">{board.title}</div>

      <div className="board-card-actions">
        <button
          className="board-edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            setEditingBoard(board);
          }}
        >
          <span className="edit-icon">
            <img src="src/resources/Frame.png" alt="" />
          </span>{" "}
          Edit this board
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
        <div
          className="navbar-logo"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
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
          <div
            className="sidebar-item"
            onClick={() => navigate("/closedboards")}
          >
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
            <h2 className="workspace">Your Workspaces </h2>
            <span className="leftbar-container">
              <div className="share-box">Share</div>
              <div className="export-box">Export</div>
              <div className="week-box">
                <div className="custom-dropdown">
                  <div className="dropdown-selected">
                    <img
                      src="/src/resources/Calendar.png"
                      alt="Calendar"
                      className="calendar-icon"
                    />
                    <span className="text-sure">This week</span>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  <div className="dropdown-options">
                    <div className="dropdown-option" data-value="thisWeek">
                      <img
                        src="/src/resources/Calendar.png"
                        alt="Calendar"
                        className="calendar-icon"
                      />
                      This week
                    </div>
                    <div className="dropdown-option" data-value="lastWeek">
                      Last week
                    </div>
                    <div className="dropdown-option" data-value="thisMonth">
                      This month
                    </div>
                    <div className="dropdown-option" data-value="lastMonth">
                      Last month
                    </div>
                  </div>
                </div>
              </div>
            </span>
          </div>
          <hr className="section-divider" />
          <div className="board-grid">
            {/* Show Workspace Boards */}
            {workspaceBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}

            {/* Create New Board */}
            <div
              className="create-board-card"
              onClick={() => setShowModal(true)}
            >
              <span className="createnewboard">Create new board</span>
            </div>
          </div>

          {/* Starred Boards Section */}
          <div className="section-header" style={{ marginTop: "40px" }}>
            <span className="section-icon">
              <img src="/src/resources/Black-star.png" alt="" />
            </span>
            <h2 className="starred">Starred Boards</h2>
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

      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
}
