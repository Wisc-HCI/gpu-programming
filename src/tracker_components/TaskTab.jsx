import React, { useState } from 'react';
import Subtask from './Subtask';

const TaskTab = (props) => {

  const dummyTitle = "Lorem Ipsum"
  const dummyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  console.log(props);

  return (
    <div>
      {props?.subtasks && props?.subtasks.map((subtask, idx) => (
        <Subtask 
          key={idx}
          title={subtask.title}
          subtext={subtask.subtext}
          // title={dummyTitle}
          // subtext={dummyText}
        />
      ))}
    </div>
  );
};

export default TaskTab;