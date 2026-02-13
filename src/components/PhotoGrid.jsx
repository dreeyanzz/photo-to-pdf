import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import PhotoCard from './PhotoCard';
import ViewToggle from './ViewToggle';
import './PhotoGrid.css';

export default function PhotoGrid({ 
  photos, 
  selectedIds, 
  onReorder, 
  onRotate, 
  onCrop, 
  onDelete, 
  onDuplicate, 
  onToggleSelect,
  view,
  onViewChange
}) {
  const [activeId, setActiveId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      onReorder(active.id, over.id);
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activePhoto = photos.find(p => p.id === activeId);
  const activeIndex = photos.findIndex(p => p.id === activeId);

  if (photos.length === 0) return null;

  return (
    <div className="photo-grid-section animate-fade-in">
      <div className="photo-grid-header">
        <h2 className="photo-grid-header__title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          Your Photos
        </h2>
        <div className="photo-grid-header__actions">
          <ViewToggle currentView={view} onViewChange={onViewChange} />
          <span className="photo-grid-header__count">{photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className={`photo-grid photo-grid--${view}`} id="photo-grid">
            {photos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={index}
                isSelected={selectedIds.has(photo.id)}
                onRotate={onRotate}
                onCrop={onCrop}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onToggleSelect={onToggleSelect}
                viewMode={view}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={null}>
          {activePhoto ? (
            <div className="photo-card photo-card--overlay">
              <div className="photo-card__index">{activeIndex + 1}</div>
              <div className="photo-card__thumbnail-wrapper">
                <img
                  src={activePhoto.editedDataUrl || activePhoto.originalDataUrl}
                  alt={activePhoto.name}
                  className="photo-card__thumbnail"
                  style={{ transform: `rotate(${activePhoto.rotation || 0}deg)` }}
                  draggable={false}
                />
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
