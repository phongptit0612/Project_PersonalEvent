import { useState, useEffect } from "react";
import { toast } from "react-toastify"; // ✅ Add this line
import "./TaskDetailModal.css";
import RichTextEditor from "./RichTextEditot";

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  description?: string;
}

interface TaskDetailModalProps {
  task: Task;
  listTitle: string;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: () => void;
}

export default function TaskDetailModal({
  task,
  listTitle,
  onClose,
  onUpdateTask,
  onDeleteTask,
}: TaskDetailModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);

  // Update local state when task prop changes
  useEffect(() => {
    setIsCompleted(task.isCompleted);
  }, [task.isCompleted]);

  const handleSaveDescription = () => {
    onUpdateTask({
      ...task,
      description,
    });
    setIsEditingDescription(false);
  };

  // ✅ Updated validation logic
  const handleTitleBlur = () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle === "") {
      toast.error("Please enter a task name");
      setTitle(task.title); // Reset to original if empty
      return;
    }

    if (trimmedTitle !== task.title) {
      onUpdateTask({
        ...task,
        title: trimmedTitle,
      });
    }
  };

  const handleToggleComplete = () => {
    const newCompletedState = !isCompleted;
    setIsCompleted(newCompletedState);
    onUpdateTask({
      ...task,
      isCompleted: newCompletedState,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Header */}
        <div className="task-modal-header">
          <div className="task-title-section">
            <span
              className={`task-icon ${isCompleted ? 'task-icon-completed' : ''}`}
              onClick={handleToggleComplete}
            >
              {isCompleted ? (
                <img src="/src/resources/checkmark.png" alt="Completed" />
              ) : (
                '○'
              )}
            </span>
            <input
              type="text"
              className="task-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
            />
          </div>
          <div className="task-list-info">
            in list <span className="list-badge">{listTitle}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="task-modal-content">
          <div className="task-modal-left">
            <div className="description-section">
              <div className="section-header">
                <span className="section-icon">☰</span>
                <h3>Description</h3>
              </div>

              {isEditingDescription ? (
                <div className="description-edit">
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                  />
                  <div className="description-actions">
                    <button className="btn-save" onClick={handleSaveDescription}>
                      Save
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => {
                        setDescription(task.description || "");
                        setIsEditingDescription(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="description-display"
                  onClick={() => setIsEditingDescription(true)}
                  dangerouslySetInnerHTML={{
                    __html:
                      description || "Add a more detailed description...",
                  }}
                />
              )}
            </div>
          </div>

          <div className="task-modal-right">
            <button className="action-btn">
              <span className="action-icon"><img src="/src/resources/Labell.png" alt="Labels" /></span> Labels
            </button>
            <button className="action-btn">
              <span className="action-icon"><img src="/src/resources/Clock.png" alt="Dates" /></span> Dates
            </button>
            <button
              className="action-btn action-btn-delete"
              onClick={onDeleteTask}
            >
              <span className="action-icon"><img src="/src/resources/Minus%20Mark.png" alt="Delete" /></span> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
