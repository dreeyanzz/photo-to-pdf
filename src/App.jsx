import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import UploadZone from './components/UploadZone';
import PhotoGrid from './components/PhotoGrid';
import CropModal from './components/CropModal';
import ExportBar from './components/ExportBar';
import BatchActions from './components/BatchActions';
import { createPhotoObject, getCroppedImg, duplicatePhoto } from './utils/imageHelpers';
import { generatePdf } from './utils/generatePdf';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [cropTarget, setCropTarget] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(null);
  const [view, setView] = useState('medium');

  // Handle new files
  const handleFilesSelected = useCallback(async (files) => {
    const newPhotos = await Promise.all(files.map(createPhotoObject));
    setPhotos((prev) => [...prev, ...newPhotos]);
  }, []);

  // Reorder
  const handleReorder = useCallback((activeId, overId) => {
    setPhotos((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === activeId);
      const newIndex = prev.findIndex((p) => p.id === overId);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  // Rotate
  const handleRotate = useCallback((id, degrees) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newRotation = ((p.rotation || 0) + degrees + 360) % 360;
        return { ...p, rotation: newRotation };
      })
    );
  }, []);

  // Open crop modal
  const handleCropOpen = useCallback(
    (id) => {
      const photo = photos.find((p) => p.id === id);
      if (photo) setCropTarget(photo);
    },
    [photos]
  );

  // Confirm crop
  const handleCropConfirm = useCallback(async (id, croppedAreaPixels) => {
    setCropTarget(null);
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          crop: croppedAreaPixels,
          width: croppedAreaPixels.width,
          height: croppedAreaPixels.height,
        };
      })
    );

    // Generate cropped preview
    const photo = photos.find((p) => p.id === id);
    if (photo) {
      const src = photo.editedDataUrl || photo.originalDataUrl;
      const cropped = await getCroppedImg(src, croppedAreaPixels);
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, editedDataUrl: cropped } : p))
      );
    }
  }, [photos]);

  // Delete
  const handleDelete = useCallback((id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  // Duplicate
  const handleDuplicate = useCallback((id) => {
    setPhotos((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;
      const photo = prev[index];
      const duplicated = duplicatePhoto(photo);
      return [...prev.slice(0, index + 1), duplicated, ...prev.slice(index + 1)];
    });
  }, []);

  // Toggle selection
  const handleToggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Batch rotate selected
  const handleBatchRotate = useCallback((degrees) => {
    if (selectedIds.size === 0) return;
    setPhotos((prev) =>
      prev.map((p) => {
        if (!selectedIds.has(p.id)) return p;
        const newRotation = ((p.rotation || 0) + degrees + 360) % 360;
        return { ...p, rotation: newRotation };
      })
    );
  }, [selectedIds]);

  // Batch delete selected
  const handleBatchDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    setPhotos((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
  }, [selectedIds]);

  // Select all
  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(photos.map((p) => p.id)));
  }, [photos]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Handle view change
  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  // Clear all
  const handleClearAll = useCallback(() => {
    setPhotos([]);
    setSelectedIds(new Set());
  }, []);

  // Generate PDF
  const handleGenerate = useCallback(
    async (pageSize, filename) => {
      if (photos.length === 0) return;
      setIsGenerating(true);
      setProgress({ current: 0, total: photos.length });

      try {
        await generatePdf(photos, pageSize, filename, (current, total) => {
          setProgress({ current, total });
        });
      } catch (err) {
        console.error('PDF generation failed:', err);
      } finally {
        setIsGenerating(false);
        setProgress(null);
      }
    },
    [photos]
  );

  return (
    <div className="app">
      {/* Header */}
      <header className="app__header">
        <div className="app__header-inner">
          <div className="app__logo">
            <div className="app__logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <circle cx="10" cy="13" r="2" />
                <path d="M20 17l-1.09-1.09a2 2 0 00-2.82 0L10 22" />
              </svg>
            </div>
            <div>
              <h1 className="app__title">Photo to PDF</h1>
              <p className="app__subtitle">Combine photos into a beautiful PDF</p>
            </div>
          </div>
          {photos.length > 0 && (
            <button className="app__clear-btn" onClick={handleClearAll}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3,6 5,6 21,6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              Clear All
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="app__main">
        <div className="app__container">
          <UploadZone onFilesSelected={handleFilesSelected} />
          
          {/* Batch actions bar */}
          {photos.length > 0 && (
            <BatchActions
              selectedCount={selectedIds.size}
              totalCount={photos.length}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              onRotateLeft={() => handleBatchRotate(-90)}
              onRotateRight={() => handleBatchRotate(90)}
              onDeleteSelected={handleBatchDelete}
            />
          )}
          
          <PhotoGrid
            photos={photos}
            selectedIds={selectedIds}
            onReorder={handleReorder}
            onRotate={handleRotate}
            onCrop={handleCropOpen}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onToggleSelect={handleToggleSelect}
            view={view}
            onViewChange={handleViewChange}
          />
        </div>
      </main>

      {/* Export bar - only show when photos exist */}
      {photos.length > 0 && (
        <div className="app__export-wrapper">
          <div className="app__container">
            <ExportBar
              photoCount={photos.length}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              progress={progress}
            />
          </div>
        </div>
      )}

      {/* Crop modal */}
      {cropTarget && (
        <CropModal
          photo={cropTarget}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropTarget(null)}
        />
      )}
    </div>
  );
}

export default App;
