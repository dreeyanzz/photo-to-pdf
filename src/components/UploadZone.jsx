import { useCallback, useRef, useState } from 'react';
import { isValidImageFile, ACCEPTED_TYPES } from '../utils/imageHelpers';
import './UploadZone.css';

export default function UploadZone({ onFilesSelected }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      const validFiles = Array.from(files).filter(isValidImageFile);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [onFilesSelected]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  return (
    <div
      className={`upload-zone ${isDragOver ? 'upload-zone--active' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      id="upload-zone"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        className="upload-zone__input"
        onChange={handleInputChange}
      />

      <div className="upload-zone__content">
        <div className="upload-zone__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17,8 12,3 7,8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <h3 className="upload-zone__title">
          {isDragOver ? 'Drop your photos here' : 'Drag & drop photos here'}
        </h3>
        <p className="upload-zone__subtitle">
          or <span className="upload-zone__link">browse files</span>
        </p>
        <p className="upload-zone__formats">
          Supports JPG, PNG, WEBP
        </p>
      </div>
    </div>
  );
}
