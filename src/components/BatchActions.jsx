import './BatchActions.css';

export default function BatchActions({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onRotateLeft,
  onRotateRight,
  onDeleteSelected,
}) {
  const hasSelection = selectedCount > 0;

  return (
    <div className={`batch-actions ${hasSelection ? 'batch-actions--active' : ''}`}>
      <div className="batch-actions__inner">
        {/* Selection info */}
        <div className="batch-actions__info">
          {hasSelection ? (
            <>
              <span className="batch-actions__count">
                {selectedCount} selected
              </span>
              <button
                className="batch-actions__clear-btn"
                onClick={onClearSelection}
              >
                Clear selection
              </button>
            </>
          ) : (
            <button
              className="batch-actions__select-all-btn"
              onClick={onSelectAll}
            >
              Select all ({totalCount})
            </button>
          )}
        </div>

        {/* Batch actions */}
        {hasSelection && (
          <div className="batch-actions__buttons">
            <button
              className="batch-actions__btn"
              onClick={onRotateLeft}
              title="Rotate selected left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1,4 1,10 7,10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Rotate Left
            </button>
            <button
              className="batch-actions__btn"
              onClick={onRotateRight}
              title="Rotate selected right"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23,4 23,10 17,10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Rotate Right
            </button>
            <button
              className="batch-actions__btn batch-actions__btn--danger"
              onClick={onDeleteSelected}
              title="Delete selected"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3,6 5,6 21,6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
              Delete ({selectedCount})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
