import React, { useState } from 'react';
import TaskTab from './TaskTab';
import './TrackerScreen.css';
import useStore from "../Store";
import { useShallow } from 'zustand/react/shallow';

const TrackerScreen = () => {

  const [activeTab, setActiveTab] = useState(0);

  const getAllTasks = useStore(useShallow((state) => state.getAllTasks));
  const getMainTasks = useStore(useShallow((state) => state.getMainTasks));
  const allTasks = getAllTasks();
  const mainTasks = getMainTasks();
  
  const handleTabChange = (idx) => {
    setActiveTab(idx);
  };

  const handleNextTask = () => {
    if (activeTab < (Object.keys(mainTasks).length - 1)) {
      setActiveTab(activeTab + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' }); // NOT WORKING: scroll back to top when user moves to next tab
  };

  return (
    <div>
      <div className="tabs-container">
        {Object.keys(mainTasks).map((key, idx) => (
          <div
            key={key}
            className={`tab ${idx === activeTab ? 'active' : ''}`}
            onClick={() => handleTabChange(idx)}
          >
            {mainTasks[key].name}
          </div>
        ))}
      </div>
      <div className="task-tab-container">
        {(
          <TaskTab
            key={Object.keys(mainTasks)[activeTab]}
            subtasks={mainTasks[Object.keys(mainTasks)[activeTab]].subtasks.map(subtaskName => allTasks[subtaskName])}
            allTasks={allTasks}
            onNextTask={handleNextTask}
          />
        )}
      </div>
    </div>
  );
};

export default TrackerScreen;

