import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../../stores/hook";
import {
  addList,
  updateList,
  deleteList,
  addTask,
  updateTask,
  deleteTask,
  toggleStar,
  setBoards,
  setCurrentBoardId,
  updateBoard,
} from "../../stores/boardSlice";
import axios from "axios";
import ConfirmDeleteModal from "./Modal/ConfirmDeleteModal";
import TaskDetailModal from "./Modal/TaskDetailModal";
import "../Dashboard/Dashboard.css";
import "./Boards.css";

// ========================================
// DATA TYPES
// ========================================
interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  description?: string;
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
export default function Board() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get current board from Redux
  const boards = useAppSelector((state) => state.boards.boards);
  const currentBoardId = useAppSelector((state) => state.boards.currentBoardId);
  const currentBoard = boards.find((b) => b.id === currentBoardId);

  // User and loading state
  const [user, setUser] = useState<User | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // List editing states
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [listBeingEdited, setListBeingEdited] = useState<List | null>(null);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Task editing states
  const [showTaskInput, setShowTaskInput] = useState<{
    [listId: string]: boolean;
  }>({});
  const [newTaskNames, setNewTaskNames] = useState<{
    [listId: string]: string;
  }>({});
  const [taskDetailModal, setTaskDetailModal] = useState<{
    task: Task;
    listId: string;
    listTitle: string;
  } | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<{
    task: Task;
    listId: string;
  } | null>(null);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // ========================================
  // LOAD DATA WHEN PAGE OPENS
  // ========================================
  useEffect(() => {
    // Get user data from server
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
    // Save boards to server
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

    // Only save after first load is complete
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
  // STAR/UNSTAR BOARD
  // ========================================
  const starBoard = () => {
    if (currentBoardId) {
      dispatch(toggleStar(currentBoardId));
    }
  };

  // ========================================
  // NAVIGATE TO BOARD
  // ========================================
  const handleBoardClick = (boardId: string) => {
    dispatch(setCurrentBoardId(boardId));
  };

  // ========================================
  // CLOSE BOARD
  // ========================================
  const closeBoard = () => {
    if (!currentBoard) return;

    const updatedBoard: Board = {
      ...currentBoard,
      isClosed: true,
    };

    dispatch(updateBoard(updatedBoard));
    setShowCloseConfirm(false);
    toast.success("Board closed!");
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  // ========================================
  // LIST FUNCTIONS
  // ========================================

  // Create new list
  const createList = () => {
    if (!newListName.trim()) {
      toast.error("Please enter a list name");
      return;
    }
    if (!currentBoardId) return;

    const newList: List = {
      id: Date.now().toString(),
      title: newListName,
      tasks: [],
    };

    dispatch(addList({ boardId: currentBoardId, list: newList }));
    setNewListName("");
    setIsAddingList(false);
    toast.success("List created!");
  };

  // Save edited list title
  const saveListTitle = (newTitle: string) => {
    if (!listBeingEdited || !currentBoardId) return;

    if (!newTitle.trim()) {
      toast.error("Please enter a list name");
      return;
    }

    const updated: List = { ...listBeingEdited, title: newTitle };
    dispatch(updateList({ boardId: currentBoardId, list: updated }));
    setListBeingEdited(null);
    toast.success("List updated!");
  };

  // Delete list
  const deleteListConfirmed = () => {
    if (!listToDelete || !currentBoardId) return;

    dispatch(deleteList({ boardId: currentBoardId, listId: listToDelete }));
    setListToDelete(null);
    toast.success("List deleted!");
  };

  // ========================================
  // TASK FUNCTIONS
  // ========================================

  // Create new task in a list
  const createTask = (listId: string) => {
    const taskName = newTaskNames[listId];
    if (!taskName?.trim()) {
      toast.error("Please enter a task name");
      return;
    }
    if (!currentBoardId) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskName,
      isCompleted: false,
    };

    dispatch(addTask({ boardId: currentBoardId, listId, task: newTask }));
    setNewTaskNames({ ...newTaskNames, [listId]: "" });
    setShowTaskInput({ ...showTaskInput, [listId]: false });
    toast.success("Task created!");
  };

  // Update task from modal
  const updateTaskFromModal = (updatedTask: Task) => {
    if (!taskDetailModal || !currentBoardId) return;

    dispatch(
      updateTask({
        boardId: currentBoardId,
        listId: taskDetailModal.listId,
        task: updatedTask,
      })
    );
  };

  // Delete task
  const deleteTaskConfirmed = () => {
    if (!taskToDelete || !currentBoardId) return;

    dispatch(
      deleteTask({
        boardId: currentBoardId,
        listId: taskToDelete.listId,
        taskId: taskToDelete.task.id,
      })
    );
    setTaskToDelete(null);
    toast.success("Task deleted!");
  };

  // ========================================
  // RENDER: ERROR STATE
  // ========================================
  if (!currentBoard) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>No board selected. Please go back to dashboard.</p>
        <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
      </div>
    );
  }

  // ========================================
  // RENDER: MAIN UI
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

          <div
            className="sidebar-item active"
            onClick={() => navigate("/dashboard")}
          >
            <img src="/src/resources/Sidebar_Menu.png" alt="" /> Boards
          </div>
          <div className="sidebar-item" onClick={() => navigate("/dashboard")}>
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
          <div className="sidebar-item" onClick={logout}>
            <img src="/src/resources/Sidebar_LogOut.png" alt="" /> Sign out
          </div>

          <div className="sidebar-divider"></div>

          <div className="your-boards-section">
            <h4>Your boards</h4>
            <button className="add-board-btn">+</button>
          </div>

          {/* Show all boards (exclude closed boards) */}
          {boards
            .filter((b) => !b.isClosed)
            .map((board) => (
              <div
                key={board.id}
                className="sidebar-board-item"
                onClick={() => handleBoardClick(board.id)}
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

        {/* Main Board Area */}
        <div className="board-main">
          {/* Board Header */}
          <div className="board-header">
            <div className="board-header-left">
              <h2 className="board-title">{currentBoard.title}</h2>
              <span className="star-btn" onClick={starBoard}>
                {currentBoard.isStarred ? "★" : "☆"}
              </span>
            </div>
            <div className="board-header-right">
              <span className="board-btn-board">
                <img src="/src/resources/Link - Board.png" alt="" />
              </span>
              <span className="board-btn">
                <img src="/src/resources/List.png" alt="" />
                Table
              </span>
              <span
                className="board-btn"
                onClick={() => setShowCloseConfirm(true)}
              >
                <img src="/src/resources/Close this.png" alt="" />
                Close this board
              </span>
              <span className="board-btn filters-btn">
                <img src="/src/resources/Img - Filter cards.png" alt="" />
                Filters
              </span>
            </div>
          </div>

          {/* Lists Area */}
          <div className="board-lists-container">
            {/* Show each list */}
            {currentBoard.lists?.map((list) => (
              <div key={list.id} className="board-list">
                {/* List Title */}
                <div className="list-header">
                  {listBeingEdited?.id === list.id ? (
                    // Editing mode
                    <input
                      type="text"
                      value={listBeingEdited.title}
                      onChange={(e) =>
                        setListBeingEdited({
                          ...listBeingEdited,
                          title: e.target.value,
                        })
                      }
                      onBlur={() => saveListTitle(listBeingEdited.title)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          saveListTitle(listBeingEdited.title);
                        if (e.key === "Escape") setListBeingEdited(null);
                      }}
                      autoFocus
                      className="list-title-input"
                    />
                  ) : (
                    // Normal mode
                    <>
                      <h3>{list.title}</h3>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <button
                          className="list-menu-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === list.id ? null : list.id
                            );
                          }}
                        >
                          ⋯
                        </button>
                        {openMenuId === list.id && (
                          <div
                            tabIndex={0}
                            onBlur={() => setOpenMenuId(null)}
                            style={{
                              position: "absolute",
                              top: "28px",
                              right: 0,
                              background: "#fff",
                              border: "1px solid #ddd",
                              borderRadius: 4,
                              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                              zIndex: 10,
                              minWidth: 120,
                              padding: "6px 0",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                setListBeingEdited({ ...list });
                                setOpenMenuId(null);
                              }}
                              className="edit-button-dropdown"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setListToDelete(list.id);
                                setOpenMenuId(null);
                              }}
                              className="delete-button-dropdown"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Tasks in this list */}
                <div className="list-cards">
                  {list.tasks?.map((task) => (
                    <div
                      key={task.id}
                      className="board-card-item"
                      onClick={() =>
                        setTaskDetailModal({
                          task,
                          listId: list.id,
                          listTitle: list.title,
                        })
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      {task.isCompleted && (
                        <span style={{ marginRight: "8px" }}> <img src="/src/resources/checkmark.png" alt="" /></span>
                      )}
                      {task.title}
                    </div>
                  ))}
                </div>

                {/* Add Task Button/Form */}
                {showTaskInput[list.id] ? (
                  <div className="add-card-form">
                    <textarea
                      placeholder="Enter a title for this card..."
                      value={newTaskNames[list.id] || ""}
                      onChange={(e) =>
                        setNewTaskNames({
                          ...newTaskNames,
                          [list.id]: e.target.value,
                        })
                      }
                      autoFocus
                    />
                    <div className="add-card-actions">
                      <button
                        className="btn-add-card"
                        onClick={() => createTask(list.id)}
                      >
                        Add card
                      </button>
                      <button
                        className="btn-cancel-card"
                        onClick={() =>
                          setShowTaskInput({
                            ...showTaskInput,
                            [list.id]: false,
                          })
                        }
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="add-card-btn"
                    onClick={() =>
                      setShowTaskInput({ ...showTaskInput, [list.id]: true })
                    }
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src="/src/resources/Plus.png"
                        alt="Plus"
                        style={{
                          marginRight: "7px",
                          width: "14px",
                          height: "14px",
                        }}
                      />
                      <span>Add a card</span>
                    </div>
                  </button>
                )}
              </div>
            ))}

            {/* Add New List Button/Form */}
            {isAddingList ? (
              <div className="board-list add-list-form">
                <input
                  type="text"
                  placeholder="Enter list title..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  autoFocus
                />
                <div className="add-list-actions">
                  <button className="btn-add-list" onClick={createList}>
                    Add list
                  </button>
                  <button
                    className="btn-cancel-list"
                    onClick={() => setIsAddingList(false)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="add-list-btn"
                onClick={() => setIsAddingList(true)}
              >
                + Add another list
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {taskDetailModal && (
        <TaskDetailModal
          task={taskDetailModal.task}
          listTitle={taskDetailModal.listTitle}
          onClose={() => setTaskDetailModal(null)}
          onUpdateTask={(updatedTask) => {
            updateTaskFromModal(updatedTask);
          }}
          onDeleteTask={() => {
            setTaskDetailModal(null);
            setTaskToDelete({
              task: taskDetailModal.task,
              listId: taskDetailModal.listId,
            });
          }}
        />
      )}

      {/* Delete List Popup */}
      {listToDelete && (
        <ConfirmDeleteModal
          title="Are you sure ?"
          message="You wont be able to revert this!"
          onConfirm={deleteListConfirmed}
          onClose={() => setListToDelete(null)}
        />
      )}

      {/* Delete Task Popup */}
      {taskToDelete && (
        <ConfirmDeleteModal
          title="Are you sure ?"
          message="You wont be able to revert this!"
          onConfirm={deleteTaskConfirmed}
          onClose={() => setTaskToDelete(null)}
        />
      )}

      {/* Close Board Confirmation */}
      {showCloseConfirm && (
        <ConfirmDeleteModal
          title="Are you sure ?"
          message="You wont be able to revert this!"
          onConfirm={closeBoard}
          onClose={() => setShowCloseConfirm(false)}
        />
      )}

      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
}