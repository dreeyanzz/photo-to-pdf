import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import './CropModal.css';

export default function CropModal({ photo, onConfirm, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = () => {
    if (croppedAreaPixels) {
      onConfirm(photo.id, croppedAreaPixels);
    }
  };

  const imageSrc = photo.editedDataUrl || photo.originalDataUrl;

  return (
    <div className="crop-modal-overlay" onClick={onCancel}>
      <div className="crop-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="crop-modal__header">
          <h3 className="crop-modal__title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.13 1L6 16a2 2 0 002 2h15" />
              <path d="M1 6.13L16 6a2 2 0 012 2v15" />
            </svg>
            Crop Image
          </h3>
          <button className="crop-modal__close" onClick={onCancel} title="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="crop-modal__cropper">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: {
                borderRadius: '8px',
              },
            }}
          />
        </div>

        <div className="crop-modal__controls">
          <label className="crop-modal__zoom-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            Zoom
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="crop-modal__slider"
          />
        </div>

        <div className="crop-modal__actions">
          <button className="crop-modal__btn crop-modal__btn--cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="crop-modal__btn crop-modal__btn--confirm" onClick={handleConfirm}>
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}
