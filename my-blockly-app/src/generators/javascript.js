/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Order} from 'blockly/javascript';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

forBlock['add_text'] = function (block, generator) {
  const text = generator.valueToCode(block, 'TEXT', Order.NONE) || "''";
  const color =
    generator.valueToCode(block, 'COLOR', Order.ATOMIC) || "'#ffffff'";

  const addText = generator.provideFunction_(
      'addText',
      `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text, color) {

  // Add text to the output area.
  const outputDiv = document.getElementById('output');
  const textEl = document.createElement('p');
  textEl.innerText = text;
  textEl.style.color = color;
  outputDiv.appendChild(textEl);
}`
  );
  // Generate the function call for this block.
  const code = `${addText}(${text}, ${color});\n`;
  return code;
};







forBlock["MoveHead"] = function (block) {
  var pitch = block.getFieldValue("FIELD_MoveHead_Pitch") === "D" ? 5 : -5;
  var velocity = parseInt(block.getFieldValue("FIELD_MoveHead_Velocity"));
  var payload = null;
  var endpoint = "head";
  payload = {
    "Pitch": pitch,		//-5 - 5
    "Yaw": 0,											
    "Roll": 0,
    "Units": "position" 
  };
  var code = 'sendPostRequestToRobot("' + endpoint + '",'  + JSON.stringify(payload) + ");";
  return code;
};



forBlock["MoveHead3"] = function (block) {
  var pitch, roll, yaw;
  var endpoint = "head";
  pitch = forBlock.valueToCode(block, "FIELD_MoveHead_Pitch", forBlock.ORDER_ATOMIC);
  roll = forBlock.valueToCode(block, "FIELD_MoveHead_Roll", forBlock.ORDER_ATOMIC);
  yaw = forBlock.valueToCode(block, "FIELD_MoveHead_Yaw", forBlock.ORDER_ATOMIC);

  let payload = '{"Pitch":'+pitch+',"Yaw":'+yaw+',"Roll":'+roll+',"Units": "degrees"}';
  var code = 'sendPostRequestToRobot("' + endpoint + '",' + payload + ");";
  return code;
};



forBlock["MoveArms"] = function (block) {
  var left_position = parseInt(block.getFieldValue("FIELD_MoveArm_LeftPosition"));
  var left_velocity = parseInt(block.getFieldValue("FIELD_MoveArm_LeftVelocity"));
  var right_position = parseInt(block.getFieldValue("FIELD_MoveArm_RightPosition"));
  var right_velocity = parseInt(block.getFieldValue("FIELD_MoveArm_RightVelocity"));
  var endpoint = "arms/set"
  let payload = '{"LeftArmPosition":'+left_position+',"RightArmPosition":'+right_position+',"LeftArmVelocity":'+left_velocity+',"RightArmVelocity":'+right_velocity+'}'
  var code = 'sendPostRequestToRobot("' + endpoint + '",' + payload + ");";
  return code;
};
forBlock["MoveArms2"] = function (block) {
  var left_position = forBlock.valueToCode(block, "FIELD_MoveArm_LeftPosition", forBlock.ORDER_ATOMIC);
  var left_velocity = forBlock.valueToCode(block, "FIELD_MoveArm_LeftVelocity", forBlock.ORDER_ATOMIC);
  var right_position = forBlock.valueToCode(block, "FIELD_MoveArm_RightPosition", forBlock.ORDER_ATOMIC);
  var right_velocity = forBlock.valueToCode(block, "FIELD_MoveArm_RightVelocity", forBlock.ORDER_ATOMIC);
  let payload = '{"LeftArmPosition":'+left_position+',"RightArmPosition":'+right_position+',"LeftArmVelocity":'+left_velocity+',"RightArmVelocity":'+right_velocity+',"Units": "Position"}'
  var endpoint = "arms/set"
  var code = 'sendPostRequestToRobot("' + endpoint + '",' + payload + ");";
  return code;
};

forBlock["DriveTime"] = function (block) {
  var direction = block.getFieldValue("FIELD_DriveTime_Direction");
  var velocity = parseInt(block.getFieldValue("FIELD_DriveTime_Velocity"));
  var time = parseInt(block.getFieldValue("FIELD_DriveTime_TimeMs"));		
  var endpoint = "drive/time"		
  var linearVelocity = direction === "F" ? velocity : -velocity;
  let payload = '{"LinearVelocity":'+linearVelocity+',"AngularVelocity":0,"TimeMs":'+time+'}';
  var code = 'sendPostRequestToRobot("' + endpoint + '",' +  payload + ');';
  return code;
};
forBlock["DriveTime2"] = function (block) {
	var endpoint = "drive/time"	
  var linearVelocity = forBlock.valueToCode(block, "FIELD_DriveTime_Velocity", forBlock.ORDER_ATOMIC);
  var angularVelocity = forBlock.valueToCode(block, "FIELD_DriveTime_Angular", forBlock.ORDER_ATOMIC);
  var time = forBlock.valueToCode(block, "FIELD_DriveTime_TimeMs", forBlock.ORDER_ATOMIC);
  let payload = '{"LinearVelocity":'+linearVelocity+',"AngularVelocity":'+angularVelocity+',"TimeMs":'+time+'}';
  var code = 'sendPostRequestToRobot("' + endpoint + '",' +  payload + ');';
  return code;
};


forBlock["Turn"] = function (block) {
  var direction = block.getFieldValue("FIELD_Turn_Direction");
  var time = parseInt(block.getFieldValue("FIELD_Turn_Duration"));		
  var angularVelocity = 100;
  var linearVelocity = 0;
  var degree = direction === "L" ? 90 : -90;
  var endpoint = "drive/time"
  let payload = '{"LinearVelocity":'+linearVelocity+',"AngularVelocity":'+angularVelocity+',"TimeMs":'+time+',"Degree":'+degree+'}';
  var code = 'sendPostRequestToRobot("' + endpoint + '",' + payload + ');';
  return code;
};

forBlock["Turn2"] = function (block) {
  var direction = block.getFieldValue("FIELD_Turn_Direction");
  var time = forBlock.valueToCode(block, "FIELD_Turn_Duration", forBlock.ORDER_ATOMIC);		
  var angularVelocity = 100;
  var linearVelocity = 0;
  var degree = direction === "L" ? 90 : -90;
  let payload = '{"LinearVelocity":'+linearVelocity+',"AngularVelocity":'+angularVelocity+',"TimeMs":'+time+',"Degree":'+degree+'}';
  var endpoint = "drive/time"
  var code = 'sendPostRequestToRobot("' + endpoint + '",' + payload + ');';
  return code;
};

forBlock["Start"] = function (block) {
  return ''
}


