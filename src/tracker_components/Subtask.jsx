import React, { useState } from 'react';
import './Subtask.css';

const Subtask = (props) => {

  const [expandedHint, setExpandedHint] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleCloseHint = () => {
    setExpandedHint(null);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  
  const toggleOpenHint = (hint) => {
    expandedHint === hint ? setExpandedHint(null) : setExpandedHint(hint);
  }

  return (
    <div  key={props.title} className="subtask-card">
      <div className="subtask-checkbox-container">
        <input type="checkbox" className={`subtask-checkbox ${isChecked ? 'checked' : ''}`} onChange={handleCheckboxChange}/>
      </div>
      <div className="subtask-content">
        <h3 className="subtask-title">{props.title}</h3>
        <p className="subtask-subtext">{props.subtext}</p>
        <div className="hints-container">
          {props.hints && props.hints.map((hint, idx) => (
            <button key={idx} className={`hint-button ${expandedHint === hint ? 'selected' : ''}`} onClick={() => toggleOpenHint(hint)}>
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