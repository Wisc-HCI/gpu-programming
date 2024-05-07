import React, { useState } from 'react';
import Subtask from './Subtask';

const TaskTab = (props) => {

  return (
    <div>
      {props.subtasks.map((subtask, idx) => (
        <Subtask 
          key={idx}
          title={subtask.title}
          subtext={subtask.subtext}
        />
      ))}
    </div>
  );
};

export default TaskTab;