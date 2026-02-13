import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './PhotoCard.css';

export default function PhotoCard({ photo, onRotate, onCrop, onDelete, index }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  const previewSrc = photo.editedDataUrl || photo.originalDataUrl;
  const rotationStyle = {
    transform: `rotate(${photo.rotation || 0}deg)`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`photo-card ${isDragging ? 'photo-card--dragging' : ''}`}
      id={`photo-card-${photo.id}`}
    >
      {/* Drag handle */}
      <div className="photo-card__drag-handle" {...attributes} {...listeners}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="5" r="1.5" />
          <circle cx="15" cy="5" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="15" cy="19" r="1.5" />
        </svg>
      </div>

      {/* Index badge */}
      <div className="photo-card__index">{index + 1}</div>

      {/* Thumbnail */}
      <div className="photo-card__thumbnail-wrapper">
        <img
          src={previewSrc}
          alt={photo.name}
          className="photo-card__thumbnail"
          style={rotationStyle}
          draggable={false}
        />
      </div>

      {/* Info */}
      <div className="photo-card__info">
        <span className="photo-card__name" title={photo.name}>
          {photo.name}
        </span>
        <span className="photo-card__dimensions">
          {photo.width} × {photo.height}
        </span>
      </div>

      {/* Actions */}
      <div className="photo-card__actions">
        <button
          className="photo-card__btn photo-card__btn--rotate"
          onClick={() => onRotate(photo.id, -90)}
          title="Rotate left"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1,4 1,10 7,10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
        <button
          className="photo-card__btn photo-card__btn--rotate"
          onClick={() => onRotate(photo.id, 90)}
          title="Rotate right"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23,4 23,10 17,10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
        <button
          className="photo-card__btn photo-card__btn--crop"
          onClick={() => onCrop(photo.id)}
          title="Crop"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.13 1L6 16a2 2 0 002 2h15" />
            <path d="M1 6.13L16 6a2 2 0 012 2v15" />
          </svg>
        </button>
        <button
          className="photo-card__btn photo-card__btn--delete"
          onClick={() => onDelete(photo.id)}
          title="Remove"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3,6 5,6 21,6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
