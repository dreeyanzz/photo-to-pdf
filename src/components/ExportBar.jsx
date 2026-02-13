import { useState } from 'react';
import './ExportBar.css';

export default function ExportBar({ photoCount, onGenerate, isGenerating, progress }) {
  const [pageSize, setPageSize] = useState('match');

  const handleGenerate = () => {
    onGenerate(pageSize);
  };

  const progressPercent = progress
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="export-bar animate-slide-up" id="export-bar">
      <div className="export-bar__inner">
        {/* Left: settings */}
        <div className="export-bar__settings">
          <div className="export-bar__setting">
            <label className="export-bar__label" htmlFor="page-size-select">
              Page Size
            </label>
            <select
              id="page-size-select"
              className="export-bar__select"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              disabled={isGenerating}
            >
              <option value="match">Match Photo Dimensions</option>
              <option value="a4">A4 (210 × 297 mm)</option>
              <option value="letter">Letter (8.5 × 11 in)</option>
              <option value="legal">Legal (8.5 × 14 in)</option>
            </select>
          </div>
        </div>

        {/* Right: generate */}
        <div className="export-bar__action">
          {isGenerating && (
            <div className="export-bar__progress">
              <div
                className="export-bar__progress-bar"
                style={{ width: `${progressPercent}%` }}
              />
              <span className="export-bar__progress-text">
                {progress.current}/{progress.total}
              </span>
            </div>
          )}
          <button
            className="export-bar__generate-btn"
            onClick={handleGenerate}
            disabled={photoCount === 0 || isGenerating}
            id="generate-pdf-btn"
          >
            {isGenerating ? (
              <>
                <svg className="export-bar__spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9,15 12,12 15,15" />
                </svg>
                Generate PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
