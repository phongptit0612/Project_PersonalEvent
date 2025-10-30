interface ConfirmDeleteModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDeleteModal({
  title,
  message,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-icon">
          <img src="/src/resources/Border.png" alt="" />
        </div>

        <h2>{title}</h2>
        <p>{message}</p>

        <div className="modal-buttons">
          <button className="btn btn-delete" onClick={onConfirm}>
            Yes, delete it!
          </button>
          <button className="btn btn-cancel2" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
