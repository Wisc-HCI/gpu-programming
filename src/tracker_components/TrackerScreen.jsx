import React, { useState } from 'react';
import TaskTab from './TaskTab';
import './TrackerScreen.css';
import useStore from "../Store";
import { useShallow } from 'zustand/react/shallow';

const TrackerScreen = ({isPlanningScreen=false}) => {

  const [activeTab, setActiveTab] = useState(0);

  const getAllTasks = useStore(useShallow((state) => state.getAllTasks));
  const getMainTasks = useStore(useShallow((state) => state.getMainTasks));
  const allTasks = getAllTasks(isPlanningScreen);
  const mainTasks = getMainTasks(isPlanningScreen);
  
  const handleTabChange = (idx) => {
    setActiveTab(idx);
  };

  const handleNextTask = () => {
    if (activeTab < (Object.keys(mainTasks).length - 1)) {
      setActiveTab(activeTab + 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' }); // NOT WORKING: scroll back to top when user moves to next tab
  };

  let allKeys = Object.keys(mainTasks);

  return (
    <div>
      <div className="tabs-container">
        {allKeys.map((key, idx) => (
          <div
            key={key}
            className={`tab ${idx === activeTab ? 'active' : ''}`}
            onClick={() => handleTabChange(idx)}
          >
            Milestones - Programming
          </div>
        ))}
      </div>
      <div className="task-tab-container">
        {(
          <TaskTab
            key={allKeys[activeTab]}
            subtasks={mainTasks[allKeys[activeTab]]?.subtasks?.map(subtaskName => allTasks[subtaskName])}
            allTasks={allTasks}
            onNextTask={handleNextTask}
            hasNextTask={activeTab + 1 < allKeys.length}
            isPlanningScreen={isPlanningScreen}
          />
        )}
      </div>
    </div>
  );
};

export default TrackerScreen;

