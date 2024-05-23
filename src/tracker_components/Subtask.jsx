import React, { useState } from 'react';
import './Subtask.css';

const Subtask = (props) => {

  const [expandedHint, setExpandedHint] = useState(null);

  const handleCloseHint = () => {
    setExpandedHint(null);
  };

  const toggleOpenHint = (hint) => {
    expandedHint === hint ? setExpandedHint(null) : setExpandedHint(hint);
  }

  return (
    <div>
      <div className="subtask-card">
        <h3 className="subtask-title">{props.title}</h3>
        <p className="subtask-subtext">{props.subtext}</p>
        <div className="hints-container">
          {props.hints && props.hints.map((hint, idx) => (
            <button key={hint.title} className={`hint-button ${expandedHint === hint ? 'selected' : ''}`} onClick={() => toggleOpenHint(hint)}>
              Hint {idx+1}
            </button>
          ))}
        </div>
        {expandedHint && (
          <div className="hint-expansion">
            <p>{expandedHint.text}</p>
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