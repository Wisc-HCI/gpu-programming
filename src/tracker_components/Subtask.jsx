import React from 'react';
import './Subtask.css';

const Subtask = (props) => {

  console.log(props.title);
  console.log(props.subtext);

  return (
    <div>
      <div className="subtask-card">
      <h3 className="subtask-title">{title}</h3>
      <p className="subtask-subtext">{subtext}</p>
    </div>
    </div>
  );
};

export default Subtask;