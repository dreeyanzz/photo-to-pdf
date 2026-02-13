import './ViewToggle.css';

export default function ViewToggle({ currentView, onViewChange }) {
  const views = [
    { 
      id: 'small', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
      label: 'Small Grid',
      tooltip: 'Small grid view'
    },
    { 
      id: 'medium', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="8" height="8" />
          <rect x="13" y="3" width="8" height="8" />
          <rect x="3" y="13" width="8" height="8" />
          <rect x="13" y="13" width="8" height="8" />
        </svg>
      ),
      label: 'Medium Grid',
      tooltip: 'Medium grid view'
    },
    { 
      id: 'large', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="8" />
          <rect x="3" y="13" width="18" height="8" />
        </svg>
      ),
      label: 'Large Grid',
      tooltip: 'Large grid view'
    },
    { 
      id: 'list', 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
      label: 'List View',
      tooltip: 'List view'
    },
  ];

  return (
    <div className="view-toggle">
      {views.map((view) => (
        <button
          key={view.id}
          className={`view-toggle__btn ${currentView === view.id ? 'view-toggle__btn--active' : ''}`}
          onClick={() => onViewChange(view.id)}
          title={view.tooltip}
          aria-label={view.label}
        >
          {view.icon}
        </button>
      ))}
    </div>
  );
}
