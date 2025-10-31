import { useState, useEffect } from "react";
import "./NewBoardModal.css";

// Board data structure
interface Board {
  title: string;
  background: string;
  backgroundType: "image" | "color";
  isStarred: boolean;
  isClosed: boolean;
}

// Modal props
interface NewBoardModalProps {
  isEdit?: boolean;
  initialData?: Board;
  onSave: (boardData: Board) => void;
  onClose: () => void;
}

// 4 default background images
const DEFAULT_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
  "https://images.unsplash.com/photo-1511497584788-876760111969?w=400",
];

// 6 default colors
const DEFAULT_COLORS = [
  "linear-gradient(122.53deg, #FFB100 0%, #FA0C00 100%)", // Orange/Red
  "linear-gradient(122.53deg, #2609FF 0%, #D20CFF 100%)", // Blue/Purple
  "linear-gradient(122.53deg, #00FF2F 0%, #00FFC8 100%)", // Green/Aqua
  "linear-gradient(122.53deg, #00FFE5 0%, #004BFA 100%)", // Aqua/Blue
  "linear-gradient(122.53deg, #FFA200 0%, #EDFA00 100%)", // Orange/Yellow
  "linear-gradient(122.53deg, #FF00EA 0%, #FA0C00 100%)", // Pink/Red
];

export default function NewBoardModal({
  isEdit = false,
  initialData,
  onSave,
  onClose,
}: NewBoardModalProps) {
  // States
  const [title, setTitle] = useState("");
  const [selectedBackground, setSelectedBackground] = useState(
    DEFAULT_BACKGROUNDS[0]
  );
  const [backgroundType, setBackgroundType] = useState<"image" | "color">(
    "image"
  );
  const [error, setError] = useState("");

  // Load existing data when editing
  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title);
      setSelectedBackground(initialData.background);
      setBackgroundType(initialData.backgroundType);
    }
  }, [isEdit, initialData]);

  // Save board
  const handleSave = () => {
    // Check if title is empty
    if (!title.trim()) {
      setError("Please provide a valid board title.");
      return;
    }

    // Create board object
    const boardData: Board = {
      title: title.trim(),
      background: selectedBackground,
      backgroundType,
      isStarred: initialData?.isStarred || false,
      isClosed: initialData?.isClosed || false,
    };

    // Send data back to parent
    onSave(boardData);
  };

  // Select background image
  const handleBackgroundClick = (bg: string) => {
    setSelectedBackground(bg);
    setBackgroundType("image");
    setError("");
  };

  // Select color
  const handleColorClick = (color: string) => {
    setSelectedBackground(color);
    setBackgroundType("color");
    setError("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{isEdit ? "Edit board" : "Create board"}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Background Images Section */}
          <div className="form-section">
            <h3>Background</h3>
            <div className="background-grid">
              {DEFAULT_BACKGROUNDS.map((bg, index) => (
                <div
                  key={index}
                  className={`background-option ${selectedBackground === bg && backgroundType === "image"
                    ? "selected"
                    : ""
                    }`}
                  style={{ backgroundImage: `url(${bg})` }}
                  onClick={() => handleBackgroundClick(bg)}
                ></div>
              ))}
            </div>
          </div>

          {/* Colors Section */}
          <div className="form-section">
            <h3>Color</h3>
            <div className="color-grid">
              {DEFAULT_COLORS.map((color, index) => (
                <div
                  key={index}
                  className={`color-option ${selectedBackground === color && backgroundType === "color"
                    ? "selected"
                    : ""
                    }`}
                  style={{ background: color }}
                  onClick={() => handleColorClick(color)}
                ></div>
              ))}
            </div>
          </div>

          {/* Title Input Section */}
          <div className="form-section">
            <label className="form-label required">Board title</label>
            <input
              type="text"
              className={`form-input ${error ? "error" : ""}`}
              placeholder="E.g. Shopping list for birthday..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
            />
            {error && <div className="error-message">👋 {error}</div>}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {isEdit ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
