import React from 'react';
import './Subtask.css';

const Subtask = (props) => {

  return (
    <div>
      <div className="subtask-card">
      <h3 className="subtask-title">{props.title}</h3>
      <p className="subtask-subtext">{props.subtext}</p>
      </div>
    </div>
  );
};

export default Subtask;