import React, { useState } from 'react';
import './Subtask.css';
import DropShadowButton from '../components/DropShadowButton';
import useStore from '../Store';

const Subtask = ({title, subtext, hints, isPlanningScreen}) => {
  console.log(hints);
  console.log(title);

  let addMessageToHistory = useStore((state) => state.addMessageToHistory);

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
    <div  key={title} className="subtask-card">
      <div className="subtask-checkbox-container">
        <input type="checkbox" className={`subtask-checkbox ${isChecked ? 'checked' : ''}`} onChange={handleCheckboxChange}/>
      </div>
      <div className="subtask-content">
        <h3 className="subtask-title">{title}</h3>
        <p className="subtask-subtext">{subtext}</p>
        <div className="hints-container">
          {!isPlanningScreen && hints && hints.map((hint, idx) => (
            <button key={idx} className={`hint-button ${expandedHint === hint ? 'selected' : ''}`} onClick={() => toggleOpenHint(hint)}>
              Hint {idx+1}
            </button>
          ))}
          {isPlanningScreen && hints && hints.map((hint, _) => {
            return <DropShadowButton
              text={hint.text}
              clickFunction={() => addMessageToHistory("[Need Help]")}
            />
          })}
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