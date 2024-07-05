import React, { useState } from "react";
import "./Subtask.css";
import DropShadowButton from "../components/DropShadowButton";
import useStore from "../Store";
import { Typography } from "@mui/material";

const Subtask = ({ title, subtext, hints, isPlanningScreen }) => {
  let addMessageToHistory = useStore((state) => state.addMessageToHistory);

  const [expandedHint, setExpandedHint] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleCloseHint = () => {
    setExpandedHint(null);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (isPlanningScreen) {
      if (!isChecked) {
        addMessageToHistory(`Phase [${title}] marked complete.`);
      } else {
        addMessageToHistory(`Phase [${title}] marked not complete.`);
      }
    }
  };

  const toggleOpenHint = (hint) => {
    expandedHint === hint ? setExpandedHint(null) : setExpandedHint(hint);
  };

  return (
    <div key={title} className="subtask-card">
      <div className="subtask-checkbox-container">
        <input
          type="checkbox"
          className={`subtask-checkbox ${isChecked ? "checked" : ""}`}
          onChange={handleCheckboxChange}
        />
      </div>
      <div className="subtask-content">
        <Typography variant="h6" align={"left"} sx={{ marginBottom: "8px" }}>
          {title}
        </Typography>
        {!isChecked && <Typography variant="subtitle1" align={"left"} sx={{ color: "#666" }}>
          {subtext}
        </Typography>}
        {!isChecked && <div className="hints-container">
          {!isPlanningScreen &&
            hints &&
            hints.map((hint, idx) => (
              <DropShadowButton
                key={idx}
                text={`Hint ${idx + 1}`}
                clickFunction={() => toggleOpenHint(hint)}
              />
              // <button key={idx} className={`hint-button ${expandedHint === hint ? 'selected' : ''}`} onClick={() => toggleOpenHint(hint)}>
              //   Hint {idx+1}
              // </button>
            ))}
          {isPlanningScreen &&
            hints &&
            hints.map((hint, i) => {
              return (
                <DropShadowButton
                  key={i}
                  text={hint.text}
                  clickFunction={() => addMessageToHistory("[Need Help]")}
                />
              );
            })}
        </div>}
        {!isChecked && expandedHint && (
          <div className="hint-expansion">
            <p>{expandedHint.text}</p>
            <div className="close-button-container">
              <button className="close-button" onClick={handleCloseHint}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subtask;
