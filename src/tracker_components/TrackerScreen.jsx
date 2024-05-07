import React, { useState, useEffect } from 'react';
import TaskTab from './TaskTab';
import dummyData from './dummy_data.json';
import './TrackerScreen.css';

const TrackerScreen = () => {

  const [allTaskList, setAllTaskList] = useState(dummyData);
  const [mainTaskList, setMainTaskList] = useState([]);
  const [mainTaskKeys, setMainTaskKeys] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  // useEffect(() => {

    // object containing all tasks
    // setAllTaskList(dummyData);

    // filter out just the main tasks
    const mainTasks = Object.keys(allTaskList)
      .filter(key => allTaskList[key].type === "task")
      .sort((keyA, keyB) => allTaskList[keyA].order - allTaskList[keyB].order)
      .reduce((acc, key) => {
        acc[key] = allTaskList[key];
        return acc;
      }, {});
      
    setMainTaskList(mainTasks);
    setMainTaskKeys(Object.keys(mainTasks));
    setActiveTab(0);

    console.log(mainTasks);
    // console.log(mainTaskKeys);
    console.log(mainTaskList[mainTaskKeys[activeTab]].subtasks.map(subtaskName => allTaskList[subtaskName]));

  // }, [allTaskList]);
  
  const handleTabChange = (idx) => {
    setActiveTab(idx);
  };



  return (
    <div>
      <div className="tabs-container">
        {mainTaskKeys.map((key, idx) => (
          <div
            key={key}
            className={`tab ${idx === activeTab ? 'active' : ''}`}
            onClick={() => handleTabChange(idx)}
          >
            {mainTaskList[key].name}
          </div>
        ))}
      </div>
      <div className="task-tab-container">
        {(
          <TaskTab
            key={mainTaskKeys[activeTab]}
            subtaskList={mainTaskList[mainTaskKeys[activeTab]]?.subtasks.map(subtaskName => allTaskList[subtaskName])}
          />
        )}
      </div>
    </div>
  );
};

export default TrackerScreen;

