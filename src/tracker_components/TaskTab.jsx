import React, { useState } from 'react';
import Subtask from './Subtask';
import './TaskTab.css';

const TaskTab = (props) => {

  // add checkbox to left of each subtask, like a to do list that users can check off

  return (
    <div className="task-tab-container">
      {props?.subtasks && props?.subtasks.map((subtask) => (
        <Subtask 
          key={subtask.title}
          title={subtask.title}
          subtext={subtask.subtext}
          hints={subtask.hints.map(hintName => props.allTasks[hintName])}
        />
      ))}
      <div className="completion-card">
        <p>All steps are complete.</p>
        <button className="next-task-button" onClick={props.onNextTask}>Go To Next Task</button>
      </div>
    </div>
  );
};

export default TaskTab;