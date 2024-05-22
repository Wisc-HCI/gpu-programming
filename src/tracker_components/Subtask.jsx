import React, { useState } from 'react';
import './Subtask.css';

const Subtask = (props) => {

  const [expandedHint, setExpandedHint] = useState(null);

  const handleOpenHint = (hint) => {
    setExpandedHint(hint);
  };

  const handleCloseHint = () => {
    setExpandedHint(null);
  };

  return (
    <div>
      <div className="subtask-card">
        <h3 className="subtask-title">{props.title}</h3>
        <p className="subtask-subtext">{props.subtext}</p>
        <div className="hints-container">
          {props.hints && props.hints.map((hint) => (
            <button key={hint.title} className={`hint-button ${expandedHint === hint ? 'selected' : ''}`} onClick={() => handleOpenHint(hint)}>
              {hint.title}
            </button>
          ))}
        </div>
        {expandedHint && (
          <div className="hint-expansion">
            <p>{expandedHint.subtext}</p>
            <div className="close-button-container">
              <button className="close-button" onClick={handleCloseHint}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subtask;