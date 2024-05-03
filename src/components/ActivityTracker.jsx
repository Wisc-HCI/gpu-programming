import React from "react";

export let activityLog = "";
export const appendActivity = (text) => {
  const now = new Date();
  const timestamp = now.toLocaleString(); // You can adjust the formatting as needed

  activityLog = activityLog.concat("\n", `[${timestamp}] ${text}`);
};

export default function ActivityTracker(props) {
  //Record user activity
  //Updates to code
  //Progress in curriculum
  return {};
}
