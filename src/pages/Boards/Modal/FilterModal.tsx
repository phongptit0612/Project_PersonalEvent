interface FilterModalProps {
  onClose: () => void;
}

export default function FilterModal({ onClose }: FilterModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content filter-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Filter</h2>
        {/* Add filter options here */}
        <div className="modal-buttons">
          <button className="btn btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
