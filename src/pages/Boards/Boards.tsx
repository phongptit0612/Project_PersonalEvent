import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useAppSelector } from "../../stores/hook";
import "../Dashboard/Dashboard.css";
import "./Boards.css";

interface Card {
  id: string;
  title: string;
  description?: string;
}

interface List {
  id: string;
  title: string;
  cards: Card[];
}

export default function Board() {
  const navigate = useNavigate();
  const boards = useAppSelector((state) => state.boards.boards);

  const [lists, setLists] = useState<List[]>([
    {
      id: "1",
      title: "Todo",
      cards: [
        { id: "1", title: "Thuê DJ" },
        { id: "2", title: "Lên kịch bản chương trình" },
        { id: "3", title: "Chuẩn bị lịch" },
        { id: "4", title: "Kịch bản" },
        { id: "5", title: "Thuê MC" },
      ],
    },
    {
      id: "2",
      title: "In progress",
      cards: [],
    },
  ]);

  const [newListTitle, setNewListTitle] = useState("");
  const [showAddList, setShowAddList] = useState(false);
  const [newCardTitles, setNewCardTitles] = useState<{ [key: string]: string }>(
    {}
  );
  const [showAddCard, setShowAddCard] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    setTimeout(() => navigate("/login"), 1000);
  };

  const handleAddList = () => {
    if (!newListTitle.trim()) return;

    const newList: List = {
      id: Date.now().toString(),
      title: newListTitle,
      cards: [],
    };

    setLists([...lists, newList]);
    setNewListTitle("");
    setShowAddList(false);
  };

  const handleAddCard = (listId: string) => {
    const cardTitle = newCardTitles[listId];
    if (!cardTitle?.trim()) return;

    const newCard: Card = {
      id: Date.now().toString(),
      title: cardTitle,
    };

    setLists(
      lists.map((list) =>
        list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list
      )
    );

    setNewCardTitles({ ...newCardTitles, [listId]: "" });
    setShowAddCard({ ...showAddCard, [listId]: false });
  };

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

          <div className="sidebar-item active">
            <img src="/src/resources/Sidebar_Menu.png" alt="" /> Boards
          </div>
          <div className="sidebar-item" onClick={() => navigate("/dashboard")}>
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

          <div className="sidebar-divider"></div>

          <div className="your-boards-section">
            <h4>Your boards</h4>
            <button className="add-board-btn">+</button>
          </div>

          {boards.slice(0, 4).map((board) => (
            <div key={board.id} className="sidebar-board-item">
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

        {/* Main Board Content */}
        <div className="board-main">
          {/* Board Header */}
          <div className="board-header">
            <div className="board-header-left">
              <h2 className="board-title">Tổ chức sự kiện Year-end party !</h2>
              <button className="star-btn">☆</button>
            </div>
            <div className="board-header-right">
              <button className="board-btn">
                <img src="/src/resources/Sidebar_Menu.png" alt="" /> Board
              </button>
              <button className="board-btn">Table</button>
              <button className="board-btn">Close this board</button>
              <button className="board-btn filters-btn">Filters</button>
            </div>
          </div>

          {/* Board Lists */}
          <div className="board-lists-container">
            {lists.map((list) => (
              <div key={list.id} className="board-list">
                <div className="list-header">
                  <h3>{list.title}</h3>
                  <button className="list-menu-btn">⋯</button>
                </div>

                <div className="list-cards">
                  {list.cards.map((card) => (
                    <div key={card.id} className="board-card-item">
                      {card.title}
                    </div>
                  ))}
                </div>

                {showAddCard[list.id] ? (
                  <div className="add-card-form">
                    <textarea
                      placeholder="Enter a title for this card..."
                      value={newCardTitles[list.id] || ""}
                      onChange={(e) =>
                        setNewCardTitles({
                          ...newCardTitles,
                          [list.id]: e.target.value,
                        })
                      }
                      autoFocus
                    />
                    <div className="add-card-actions">
                      <button
                        className="btn-add-card"
                        onClick={() => handleAddCard(list.id)}
                      >
                        Add card
                      </button>
                      <button
                        className="btn-cancel-card"
                        onClick={() =>
                          setShowAddCard({ ...showAddCard, [list.id]: false })
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
                      setShowAddCard({ ...showAddCard, [list.id]: true })
                    }
                  >
                    + Add a card
                  </button>
                )}
              </div>
            ))}

            {/* Add List */}
            {showAddList ? (
              <div className="board-list add-list-form">
                <input
                  type="text"
                  placeholder="Enter list title..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  autoFocus
                />
                <div className="add-list-actions">
                  <button className="btn-add-list" onClick={handleAddList}>
                    Add list
                  </button>
                  <button
                    className="btn-cancel-list"
                    onClick={() => setShowAddList(false)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="add-list-btn"
                onClick={() => setShowAddList(true)}
              >
                + Add another list
              </button>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
}
