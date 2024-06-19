import React, { useState } from 'react';
import Subtask from './Subtask';
import './TaskTab.css';

const TaskTab = ({hasNextTask, onNextTask, allTasks, subtasks, isPlanningScreen}) => {

  // add checkbox to left of each subtask, like a to do list that users can check off

  return (
    <div className="task-tab-container">
      {subtasks && subtasks.map((subtask) => (
        <Subtask 
          key={subtask.title}
          title={subtask.title}
          subtext={subtask.subtext}
          hints={subtask.hints.map(hintName => allTasks[hintName])}
          isPlanningScreen={isPlanningScreen}
        />
      ))}
      {hasNextTask && <div className="completion-card">
        <p>All steps are complete.</p>
        <button className="next-task-button" onClick={onNextTask}>Go To Next Task</button>
      </div>}
    </div>
  );
};

export default TaskTab;