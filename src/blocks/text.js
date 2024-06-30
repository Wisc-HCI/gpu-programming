/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';
import blockColors from '../blockPallete.json';
import { MathNumSlider } from './MathNumSlider';

let allBlockTypes = []

// Create a custom block called 'add_text' that adds
// text to the output div on the sample app.
// This is just an example and you should replace this with your
// own custom blocks.
const addText = {
  'type': 'add_text',
  'message0': 'Add text %1 with color %2',
  'args0': [
    {
      'type': 'input_value',
      'name': 'TEXT',
      'check': 'String',
    },
    {
      'type': 'input_value',
      'name': 'COLOR',
      'check': 'Colour',
    },
  ],
  'previousStatement': null,
  'nextStatement': null,
  'colour': 160,
  'tooltip': '',
  'helpUrl': '',
};

// Set up the format of the block in the Blocky IDE
let changeLEDType = "ChangeLED";
allBlockTypes.push(changeLEDType);
Blockly.Blocks[changeLEDType] = {
  init: function () {
    this.setColour(blockColors["light_category"]["colour"]); // set color 
    this.appendValueInput("FIELD_ChangeLED")
      .setCheck("Colour")
      .appendField("Change the LED color to");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setOutput(false);
    this.setTooltip("Changes Misty's LED to a specified color");
  }
};

let transitionLEDType = "TransitionLED";
allBlockTypes.push(transitionLEDType);
Blockly.Blocks[transitionLEDType] = {
  init: function () {
    this.setColour(blockColors["light_category"]["colour"]);
    this.appendValueInput("COLOR1")
      .setCheck("Colour")
      .appendField("Transition LED from");
    this.appendValueInput("COLOR2")
      .setCheck("Colour")
      .appendField("to");
    this.appendDummyInput()
      .appendField("using the")
      .appendField(new Blockly.FieldDropdown([
        ["Breathe", "BREATHE"],
        ["Blink", "BLINK"],
        ["Transition Once", "TRANSITION_ONCE"]
      ]), "TRANSITION_TYPE")
      .appendField("transition");
    this.appendDummyInput()
      .appendField("for a duration of")
      .appendField(new Blockly.FieldNumber(1, 0, 60, 1), "FIELD_TransitionTime_TimeMs")
      .appendField("secs");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Transition LED between two colors with the specified transition type and time.");
  }
};

let displayImageType = "DisplayImage";
allBlockTypes.push(displayImageType);
Blockly.Blocks[displayImageType] = {
  init: function () {
    this.setColour(blockColors["face_category"]["colour"]);
    this.appendValueInput("FIELD_DisplayImage_Filename")
      .setCheck("Face")
      .appendField("Change face expression to: ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Displays an image on Misty's screen, Alpha specifies transparency (0 is completely transparent, 1 is completely opaque) ***WARNING: MUST connect with ListFilesAvailable to select the image file to display***");
  }
};


let displayAnimationType = "DisplayAnimation";
allBlockTypes.push(displayAnimationType);
Blockly.Blocks[displayAnimationType] = {
  init: function () {
    this.setColour(blockColors["misc_category"]["colour"]);
    this.appendValueInput("FIELD_DisplayAnimation_Filename")
      .setCheck("Animation")
      .appendField("Show this animation on Misty: ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Runs a specified animation on Misty");
  }
};

let moveHeadType = "MoveHead";
allBlockTypes.push(moveHeadType);
Blockly.Blocks[moveHeadType] = {
  init: function () {
    this.setColour(blockColors["movement_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Move head")
      .appendField(new Blockly.FieldDropdown([["Up", "U"], ["Down", "D"]]), "FIELD_MoveHead_Pitch")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Moves Misty's head Up or Down");
  }
};

let moveArmType = "MoveArm";
allBlockTypes.push(moveArmType);
Blockly.Blocks[moveArmType] = {
  init: function () {
    this.setColour(blockColors["movement_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Move ")
      .appendField(new Blockly.FieldDropdown([["Right", "Right"], ["Left", "Left"]]), "FIELD_MoveArm_Arm")
      .appendField("arm to position")
      .appendField(new MathNumSlider(45, -29, 90, 1, "Up", "Down"), "FIELD_MoveArm_Position")
      .appendField("at a speed of (0 to 100)")
      .appendField(new MathNumSlider(50, 0, 100, 1, "Slow", "Fast"), "FIELD_MoveArm_Velocity");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Moves one of Misty's arms to a specified position (expects a value from 0-10, 5 points the arm straight forward) at a specified speed (between 0 and 100)");
  }
};

let moveArm2Type = "MoveArm2";
allBlockTypes.push(moveArm2Type);
Blockly.Blocks[moveArm2Type] = {
  init: function () {
    this.setColour(blockColors["movement_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Move both arms to position")
      .appendField(new MathNumSlider(45, -29, 90, 1, "Up", "Down"), "FIELD_MoveArm2_Position")
      .appendField("at a speed of (0 to 100)")
      .appendField(new MathNumSlider(50, 0, 100, 1, "Slow", "Fast"), "FIELD_MoveArm2_Velocity");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Moves both of Misty's arms to a specified position (expects a value from 0-10, 5 points the arm straight forward) at a specified speed (between 0 and 100)");
  }
};

let basicSliderType = "BasicSlider";
allBlockTypes.push(basicSliderType);
Blockly.Blocks[basicSliderType] = {
  init: function () {
    this.setColour(blockColors["math_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Slider Value: ")
      .appendField(new MathNumSlider(0, 0, 100, 1, "Min", "Max"), "FIELD_slider_value");
    this.setInputsInline(false);
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setOutput(true, null);
  }
};

let armPositionSliderType = "ArmPositionSlider";
allBlockTypes.push(armPositionSliderType);
Blockly.Blocks[armPositionSliderType] = {
  init: function () {
    this.setColour(blockColors["math_category"]["colour"]);
    this.appendDummyInput()
      .appendField(new MathNumSlider(45, -29, 90, 1, "Up", "Down"), "FIELD_slider_value");
    this.setInputsInline(false);
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setOutput(true, null);
  }
};

let speedSliderType = "SpeedSlider";
allBlockTypes.push(speedSliderType);
Blockly.Blocks[speedSliderType] = {
  init: function () {
    this.setColour(blockColors["math_category"]["colour"]);
    this.appendDummyInput()
      .appendField(new MathNumSlider(1, 1, 100, 1, "Slow", "Fast"), "FIELD_slider_value");
    this.setInputsInline(false);
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setOutput(true, null);
  }
};

let timeSliderType = "TimeSlider";
allBlockTypes.push(timeSliderType);
Blockly.Blocks[timeSliderType] = {
  init: function () {
    this.setColour(blockColors["math_category"]["colour"]);
    this.appendDummyInput()
      .appendField(new MathNumSlider(1, 1, 60, 1, "Short", "Long"), "FIELD_slider_value");
    this.setInputsInline(false);
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setOutput(true, null);
  }
};

let headPitchSliderType = "HeadPitchSlider";
allBlockTypes.push(headPitchSliderType);
Blockly.Blocks[headPitchSliderType] = {
  init: function () {
    this.setColour(blockColors["math_category"]["colour"]);
    this.appendDummyInput()
      .appendField(new MathNumSlider(0, -40, 25, 1, "Up", "Down"), "FIELD_slider_value");
    this.setInputsInline(false);
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setOutput(true, null);
  }
};

let headRollSliderType = "HeadRollSlider";
allBlockTypes.push(headRollSliderType);
Blockly.Blocks[headRollSliderType] = {
  init: function () {
    this.setColour(blockColors["math_category"]["colour"]);
    this.appendDummyInput()
      .appendField(new MathNumSlider(0, -40, 40, 1, "Right", "Left"), "FIELD_slider_value");
    this.setInputsInline(false);
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setOutput(true, null);
  }
};

let headYawSliderType = "HeadYawSlider";
allBlockTypes.push(headYawSliderType);
Blockly.Blocks[headYawSliderType] = {
  init: function () {
    this.setColour(blockColors["math_category"]["colour"]);
    this.appendDummyInput()
      .appendField(new MathNumSlider(0, -81, 81, 1, "Right", "Left"), "FIELD_slider_value");
    this.setInputsInline(false);
    this.setOutput(true, null);
  }
};

let moveArms2Type = "MoveArms2";
allBlockTypes.push(moveArms2Type);
Blockly.Blocks[moveArms2Type] = {
  init: function () {
    var shadowBlock_1 = this.workspace.newBlock('ArmPositionSlider');
    shadowBlock_1.setShadow(true);
    shadowBlock_1.initSvg();
    shadowBlock_1.render();
    var lPosBlock = shadowBlock_1.outputConnection;

    var shadowBlock_2 = this.workspace.newBlock('SpeedSlider');
    shadowBlock_2.setShadow(true);
    shadowBlock_2.initSvg();
    shadowBlock_2.render();
    var lVelBlock = shadowBlock_2.outputConnection;

    var shadowBlock_3 = this.workspace.newBlock('ArmPositionSlider');
    shadowBlock_3.setShadow(true);
    shadowBlock_3.initSvg();
    shadowBlock_3.render();
    var rPosBlock = shadowBlock_3.outputConnection;

    var shadowBlock_4 = this.workspace.newBlock('SpeedSlider');
    shadowBlock_4.setShadow(true);
    shadowBlock_4.initSvg();
    shadowBlock_4.render();
    var rVelBlock = shadowBlock_4.outputConnection;

    this.setColour(blockColors["movement_category"]["colour"]);
    this.appendValueInput("FIELD_MoveArm_LeftPosition").setCheck('Number')
      .appendField("Left Arm Position");
    var shadowBlockConnectionLPosition = this.getInput("FIELD_MoveArm_LeftPosition").connection;
    shadowBlockConnectionLPosition.connect(lPosBlock);
    this.appendValueInput("FIELD_MoveArm_LeftVelocity").setCheck('Number')
      .appendField("Left Arm Speed");
    var shadowBlockConnectionLVelocity = this.getInput("FIELD_MoveArm_LeftVelocity").connection;
    shadowBlockConnectionLVelocity.connect(lVelBlock);
    this.appendValueInput("FIELD_MoveArm_RightPosition").setCheck('Number')
      .appendField("Right Arm Position");
    var shadowBlockConnectionRPosition = this.getInput("FIELD_MoveArm_RightPosition").connection;
    shadowBlockConnectionRPosition.connect(rPosBlock);
    this.appendValueInput("FIELD_MoveArm_RightVelocity").setCheck('Number')
      .appendField("Right Arm Speed");
    var shadowBlockConnectionLVelocity = this.getInput("FIELD_MoveArm_RightVelocity").connection;
    shadowBlockConnectionLVelocity.connect(rVelBlock);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Moves both of Misty's arms to a specified position (expects a value from 0-10, 5 points the arm straight forward) at a specified speed");
  }
};


let MoveArm3Type = "MoveArm3";
allBlockTypes.push(MoveArm3Type);
Blockly.Blocks[MoveArm3Type] = {
  init: function () {
    var shadowBlock_1 = this.workspace.newBlock('ArmPositionSlider');
    shadowBlock_1.setShadow(true);
    shadowBlock_1.initSvg();
    shadowBlock_1.render();
    var lPosBlock = shadowBlock_1.outputConnection;

    var shadowBlock_2 = this.workspace.newBlock('SpeedSlider');
    shadowBlock_2.setShadow(true);
    shadowBlock_2.initSvg();
    shadowBlock_2.render();
    var lVelBlock = shadowBlock_2.outputConnection;

    this.appendDummyInput()
      .appendField("Move Arm: ")
      .appendField(new Blockly.FieldDropdown([["Right", "Right"], ["Left", "Left"]]), "FIELD_MoveArm_Arm")
    this.setColour(blockColors["movement_category"]["colour"]);
    this.appendValueInput("FIELD_MoveArm_Position").setCheck('Number')
      .appendField("Left Arm Position");
    var shadowBlockConnectionLPosition = this.getInput("FIELD_MoveArm_Position").connection;
    shadowBlockConnectionLPosition.connect(lPosBlock);
    this.appendValueInput("FIELD_MoveArm_Velocity").setCheck('Number')
      .appendField("Left Arm Speed");
    var shadowBlockConnectionLVelocity = this.getInput("FIELD_MoveArm_Velocity").connection;
    shadowBlockConnectionLVelocity.connect(lVelBlock);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Moves both of Misty's arms to a specified position (expects a value from 0-10, 5 points the arm straight forward) at a specified speed");
  }
};

let DriveTimeType = "DriveTime";
allBlockTypes.push(DriveTimeType);
Blockly.Blocks[DriveTimeType] = {
  init: function () {
    this.setColour(blockColors["movement_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Move ")
      .appendField(new Blockly.FieldDropdown([["Forward", "F"], ["Backward", "B"]]), "FIELD_DriveTime_Direction")
      .appendField("at a speed of (0 to 100)")
      .appendField(new Blockly.FieldNumber(25, 0, 100, 1), "FIELD_DriveTime_Velocity")
      .appendField("for a duration of")
      .appendField(new Blockly.FieldNumber(1, 0, 60, 1), "FIELD_DriveTime_TimeMs")
      .appendField("secs");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Drives Misty straight in a specified direction at a specified speed for a specified amount of time (1000ms = 1 second)");
  }
};

let MoveHead3Type = "MoveHead3";
allBlockTypes.push(MoveHead3Type);
Blockly.Blocks[MoveHead3Type] = {

  init: function () {
    var shadowBlock_1 = this.workspace.newBlock('HeadPitchSlider');
    shadowBlock_1.setShadow(true);
    shadowBlock_1.initSvg();
    shadowBlock_1.render();
    var pitchBlock = shadowBlock_1.outputConnection;

    var shadowBlock_2 = this.workspace.newBlock('HeadRollSlider');
    shadowBlock_2.setShadow(true);
    shadowBlock_2.initSvg();
    shadowBlock_2.render();
    var rollBlock = shadowBlock_2.outputConnection;

    var shadowBlock_3 = this.workspace.newBlock('HeadYawSlider');
    shadowBlock_3.setShadow(true);
    shadowBlock_3.initSvg();
    shadowBlock_3.render();
    var yawBlock = shadowBlock_3.outputConnection;

    var shadowBlock_4 = this.workspace.newBlock('TimeSlider');
    shadowBlock_4.setShadow(true);
    shadowBlock_4.initSvg();
    shadowBlock_4.render();
    var timeBlock = shadowBlock_4.outputConnection;

    this.setColour(blockColors["movement_category"]["colour"]);

    this.appendDummyInput("FIELD_TEXT_IGNORE")
      .appendField("Move head");
    this.appendValueInput("FIELD_MoveHead_Pitch").setCheck('Number')
      .appendField("Look Up/Down:");
    var shadowBlockConnectionPitch = this.getInput("FIELD_MoveHead_Pitch").connection;
    shadowBlockConnectionPitch.connect(pitchBlock);

    this.appendValueInput("FIELD_MoveHead_Roll").setCheck('Number')
      .appendField("Tilt Left/Right:");
    var shadowBlockConnectionRoll = this.getInput("FIELD_MoveHead_Roll").connection;
    shadowBlockConnectionRoll.connect(rollBlock);

    this.appendValueInput("FIELD_MoveHead_Yaw").setCheck('Number')
      .appendField("Look Right/Left:");
    var shadowBlockConnectionYaw = this.getInput("FIELD_MoveHead_Yaw").connection;
    shadowBlockConnectionYaw.connect(yawBlock);

    this.appendValueInput("FIELD_MoveHead_Time").setCheck('Number')
      .appendField("Time (seconds):");
    var shadowBlockConnectionTime = this.getInput("FIELD_MoveHead_Time").connection;
    shadowBlockConnectionTime.connect(timeBlock);

    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Moves Misty's head a specified amount of degrees with roll, pitch, and/or yaw");
  }
};

let DriveTime2Type = "DriveTime2";
allBlockTypes.push(DriveTime2Type);
Blockly.Blocks[DriveTime2Type] = {
					
  init: function () {
    var shadowBlock_1 = this.workspace.newBlock('math_number');
    shadowBlock_1.setShadow(true);
    shadowBlock_1.initSvg();
    shadowBlock_1.render();
    var velocityBlock = shadowBlock_1.outputConnection;

    var shadowBlock_2 = this.workspace.newBlock('math_number');
    shadowBlock_2.setShadow(true);
    shadowBlock_2.initSvg();
    shadowBlock_2.render();
    var angularBlock = shadowBlock_2.outputConnection;

    var shadowBlock_3 = this.workspace.newBlock('math_number');
    shadowBlock_3.setShadow(true);
    shadowBlock_3.initSvg();
    shadowBlock_3.render();
    var timeBlock = shadowBlock_3.outputConnection;

    this.setColour(blockColors["movement_category"]["colour"]);
    this.appendValueInput("FIELD_DriveTime_Velocity").setCheck('Number')
      .appendField("Move at a speed of (-100 to 100)");
    var shadowBlockConnectionVelocity = this.getInput("FIELD_DriveTime_Velocity").connection;
    shadowBlockConnectionVelocity.connect(velocityBlock);
    this.appendValueInput("FIELD_DriveTime_Angular").setCheck('Number')
      .appendField("with angular velocity of (-100 CW to 100 CCW)");
    var shadowBlockConnectionAngular = this.getInput("FIELD_DriveTime_Angular").connection;
    shadowBlockConnectionAngular.connect(angularBlock);
    this.appendValueInput("FIELD_DriveTime_TimeMs").setCheck('Number')
      .appendField("for a duration of secs");
    var shadowBlockConnectionTime = this.getInput("FIELD_DriveTime_TimeMs").connection;
    shadowBlockConnectionTime.connect(timeBlock);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Drives Misty forward (positive speed) or backward (negative speed) with possible turning using angular velocity (0 for straight) for the specified duration (1000 ms = 1 second)");
  }
};

let TurnType = "Turn";
allBlockTypes.push(TurnType);
Blockly.Blocks[TurnType] = {
  init: function () {
    this.setColour(blockColors["movement_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Turn")
      .appendField(new Blockly.FieldDropdown([["Left", "L"], ["Right", "R"]]), "FIELD_Turn_Direction")
      .appendField("for time of")
      .appendField(new Blockly.FieldNumber(4500), "FIELD_Turn_Duration")
      .appendField("milliseconds");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Turns Misty in the specified direction (1000ms = 1 second and 4500ms is approximately 90 degrees)");
  }
};

let Turn2Type = "Turn2";
allBlockTypes.push(Turn2Type);
Blockly.Blocks[Turn2Type] = {
  init: function () {
    var shadowBlock_1 = this.workspace.newBlock('math_number');
    shadowBlock_1.setShadow(true);
    shadowBlock_1.initSvg();
    shadowBlock_1.render();
    var timeBlock = shadowBlock_1.outputConnection;

    this.setColour(blockColors["movement_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Turn")
      .appendField(new Blockly.FieldDropdown([["Left", "L"], ["Right", "R"]]), "FIELD_Turn_Direction");
    this.appendValueInput("FIELD_Turn_Duration").setCheck('Number')
      .appendField("for time of");
      var shadowBlockConnectionTime = this.getInput("FIELD_Turn_Duration").connection;
      shadowBlockConnectionTime.connect(timeBlock);
    this.appendDummyInput()
      .appendField("seconds");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Turns Misty in the specified direction (1000ms = 1 second and 4500ms is approximately 90 degrees)");
  }
};

let SpeakType = "Speak";
allBlockTypes.push(SpeakType);
Blockly.Blocks[SpeakType] = {
  init: function () {
    this.setColour(blockColors["speech_category"]["colour"]);
    this.appendValueInput("FIELD_Speak_Text")
      .setCheck("String")
      .appendField("Speak: ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Speak given input text");
  }
};

// TODO: Add another Speak block with a dropdown with defaults: “Hi”, “Hello”, etc.
let SpeakDefaultType = "SpeakDefault";
allBlockTypes.push(SpeakDefaultType);
Blockly.Blocks[SpeakDefaultType] = {
  init: function () {
    this.setColour(blockColors["speech_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Speak: ")
      .appendField(new Blockly.FieldDropdown([
        ["Hi", "Hi"],
        ["Hello", "Hello"],
        ["How are you today?", "How are you today?"],
        ["Goodbye", "Goodbye"]
      ]), "FIELD_SpeakDefault_Text");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Speak given selected default text");
  }
};

let TurnOnFlashlightType = "TurnOnFlashlight";
allBlockTypes.push(TurnOnFlashlightType);
Blockly.Blocks[TurnOnFlashlightType] = {
  init: function () {
    this.setColour(blockColors["light_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Turn on flashlight ")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Turn on flashlight");
  }
};

let TurnOffFlashlightType = "TurnOffFlashlight";
allBlockTypes.push(TurnOffFlashlightType);
Blockly.Blocks[TurnOffFlashlightType] = {
  init: function () {
    this.setColour(blockColors["light_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Turn off flashlight ")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Turn off flashlight");
  }
};

let WaitForSecondsType = "WaitForSeconds";
allBlockTypes.push(WaitForSecondsType);
Blockly.Blocks[WaitForSecondsType] = {
  init: function() {
    this.appendDummyInput()
        .appendField("wait for");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldNumber(0, -Infinity, Infinity, 0.1), "NumSeconds");
    this.appendDummyInput()
        .appendField("Seconds");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(blockColors["movement_category"]["colour"]);
    this.setTooltip("Delay the execution of the next block by some number of seconds");
  }
};

let PlayAudioType = "PlayAudio";
allBlockTypes.push(PlayAudioType);
Blockly.Blocks[PlayAudioType] = {
  init: function () {
    this.setColour(blockColors["audio_category"]["colour"]);
    this.appendValueInput("FIELD_PlayAudio_Filename")
      .setCheck("Audio")
      .appendField("Play audio: ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
  }
};


let SetVolumeType = "SetVolume";
allBlockTypes.push(SetVolumeType);
Blockly.Blocks[SetVolumeType] = {
					
  init: function () {
    this.setColour(blockColors["audio_category"]["colour"]);
    var shadowBlock_1 = this.workspace.newBlock('math_number');
    shadowBlock_1.setShadow(true);
    shadowBlock_1.initSvg();
    shadowBlock_1.render();
    var audioLevel = shadowBlock_1.outputConnection;

    this.appendValueInput("FIELD_Volume").setCheck('Number')
      .appendField("Set volume to (0-100): ");
    var shadowBlockConnectionAudioLevel = this.getInput("FIELD_Volume").connection;
    shadowBlockConnectionAudioLevel.connect(audioLevel);

    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);

    this.setTooltip("Adjusts Misty's volume level for audio playback");
  }
};

let DisplayTextType = "DisplayText";
allBlockTypes.push(DisplayTextType);
Blockly.Blocks[DisplayTextType] = {
  init: function () {
    this.setColour(blockColors["face_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Display Text: ")
      .appendField(new Blockly.FieldTextInput("default"), "FIELD_DisplayText_Text");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
  }
};


let ClearText = "ClearText";
allBlockTypes.push(ClearText);
Blockly.Blocks[ClearText] = {
  init: function () {
    this.setColour(blockColors["face_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Clear Text")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
  }
};

let Start = "Start";
allBlockTypes.push(Start)
Blockly.Blocks[Start] = {
  init: function () {
    this.setStyle("hat_blocks");
    this.appendDummyInput().appendField("Program starts here");
    this.setColour(blockColors["trigger_category"]["colour"]);
    this.setTooltip("This is the starting block");
    this.setNextStatement(true, null);
    this.setHelpUrl("");
    this.setDeletable(false);
  },
};

let FrontLeftBumperPress = "FrontLeftBumperPress";
allBlockTypes.push(FrontLeftBumperPress)
Blockly.Blocks[FrontLeftBumperPress] = {
  init: function () {
    this.setStyle("hat_blocks");
    this.setColour(blockColors["trigger_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Front Left Bumper Pressed")
    this.setNextStatement(true, null);
    this.setTooltip("");
  }
};

let FrontRightBumperPress = "FrontRightBumperPress";
allBlockTypes.push(FrontRightBumperPress)
Blockly.Blocks[FrontRightBumperPress] = {
  init: function () {
    this.setStyle("hat_blocks");
    this.setColour(blockColors["trigger_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Front Right Bumper Pressed")
    this.setNextStatement(true, null);
    this.setTooltip("");
  }
};

let RearLeftBumperPress = "RearLeftBumperPress";
allBlockTypes.push(RearLeftBumperPress)
Blockly.Blocks[RearLeftBumperPress] = {
  init: function () {
    this.setStyle("hat_blocks");
    this.setColour(blockColors["trigger_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Rear Left Bumper Pressed")
    this.setNextStatement(true, null);
    this.setTooltip("");
  }
};

let RearRightBumperPress = "RearRightBumperPress";
allBlockTypes.push(RearRightBumperPress)
Blockly.Blocks[RearRightBumperPress] = {
  init: function () {
    this.setStyle("hat_blocks");
    this.setColour(blockColors["trigger_category"]["colour"]);
    this.appendDummyInput()
      .appendField("Right Rear Bumper Pressed")
    this.setNextStatement(true, null);
    this.setTooltip("");
  }
};

// Face blocks
let eyes_acceptance = "eyes_acceptance";
allBlockTypes.push(eyes_acceptance);
Blockly.Blocks[eyes_acceptance] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: acceptance");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'acceptance'");
  }
};

let eyes_admiration = "eyes_admiration";
allBlockTypes.push(eyes_admiration);
Blockly.Blocks[eyes_admiration] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: admiration");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'admiration'");
  }
};

let eyes_amazement = "eyes_amazement";
allBlockTypes.push(eyes_amazement);
Blockly.Blocks[eyes_amazement] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: amazement");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'amazement'");
  }
};

let eyes_anger = "eyes_anger";
allBlockTypes.push(eyes_anger);
Blockly.Blocks[eyes_anger] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: anger");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'anger'");
  }
};

let eyes_annoyed = "eyes_annoyed";
allBlockTypes.push(eyes_annoyed);
Blockly.Blocks[eyes_annoyed] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: annoyed");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'annoyed'");
  }
};

let eyes_anticipation = "eyes_anticipation";
allBlockTypes.push(eyes_anticipation);
Blockly.Blocks[eyes_anticipation] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: anticipation");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'anticipation'");
  }
};

let eyes_apprehension = "eyes_apprehension";
allBlockTypes.push(eyes_apprehension);
Blockly.Blocks[eyes_apprehension] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: apprehension");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'apprehension'");
  }
};

let eyes_boredom = "eyes_boredom";
allBlockTypes.push(eyes_boredom);
Blockly.Blocks[eyes_boredom] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: boredom");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'boredom'");
  }
};

let eyes_default = "eyes_default";
allBlockTypes.push(eyes_default);
Blockly.Blocks[eyes_default] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: default");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'default'");
  }
};

let eyes_disgust = "eyes_disgust";
allBlockTypes.push(eyes_disgust);
Blockly.Blocks[eyes_disgust] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: disgust");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'disgust'");
  }
};

let eyes_distraction = "eyes_distraction";
allBlockTypes.push(eyes_distraction);
Blockly.Blocks[eyes_distraction] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: distraction");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'distraction'");
  }
};

let eyes_ecstasy_frame_1 = "eyes_ecstasy_frame_1";
allBlockTypes.push(eyes_ecstasy_frame_1);
Blockly.Blocks[eyes_ecstasy_frame_1] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: ecstasy 1");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'ecstasy 1'");
  }
};

let eyes_ecstasy_frame_2 = "eyes_ecstasy_frame_2";
allBlockTypes.push(eyes_ecstasy_frame_2);
Blockly.Blocks[eyes_ecstasy_frame_2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: ecstasy 2");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'ecstasy 2'");
  }
};

let eyes_fear = "eyes_fear";
allBlockTypes.push(eyes_fear);
Blockly.Blocks[eyes_fear] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: fear");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'fear'");
  }
};

let eyes_grief = "eyes_grief";
allBlockTypes.push(eyes_grief);
Blockly.Blocks[eyes_grief] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: grief");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'grief'");
  }
};

let eyes_interest = "eyes_interest";
allBlockTypes.push(eyes_interest);
Blockly.Blocks[eyes_interest] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: interest");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'interest'");
  }
};

let eyes_joy = "eyes_joy";
allBlockTypes.push(eyes_joy);
Blockly.Blocks[eyes_joy] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: joy");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'joy'");
  }
};

let eyes_loathing = "eyes_loathing";
allBlockTypes.push(eyes_loathing);
Blockly.Blocks[eyes_loathing] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: loathing");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'loathing'");
  }
};

let eyes_pensiveness = "eyes_pensiveness";
allBlockTypes.push(eyes_pensiveness);
Blockly.Blocks[eyes_pensiveness] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: pensiveness");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'pensiveness'");
  }
};

let eyes_rage = "eyes_rage";
allBlockTypes.push(eyes_rage);
Blockly.Blocks[eyes_rage] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: rage eyes");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'rage eyes'");
  }
};

let eyes_sad = "eyes_sad";
allBlockTypes.push(eyes_sad);
Blockly.Blocks[eyes_sad] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: sad");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'sad'");
  }
};

let eyes_serenity = "eyes_serenity";
allBlockTypes.push(eyes_serenity);
Blockly.Blocks[eyes_serenity] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: serenity");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'serenity'");
  }
};

let eyes_surprise = "eyes_surprise";
allBlockTypes.push(eyes_surprise);
Blockly.Blocks[eyes_surprise] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: surprise");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'surprise'");
  }
};

let eyes_terror = "eyes_terror";
allBlockTypes.push(eyes_terror);
Blockly.Blocks[eyes_terror] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: terror");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'terror'");
  }
};

let eyes_trust = "eyes_trust";
allBlockTypes.push(eyes_trust);
Blockly.Blocks[eyes_trust] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: trust");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'trust'");
  }
};

let eyes_vigilance = "eyes_vigilance";
allBlockTypes.push(eyes_vigilance);
Blockly.Blocks[eyes_vigilance] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: vigilance");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'vigilance'");
  }
};

let e_Sleeping = "e_Sleeping";
allBlockTypes.push(e_Sleeping);
Blockly.Blocks[e_Sleeping] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: sleeping");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'sleeping'");
  }
};

let e_SleepingZZZ = "e_SleepingZZZ";
allBlockTypes.push(e_SleepingZZZ);
Blockly.Blocks[e_SleepingZZZ] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: sleeping ZZZ");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'sleeping ZZZ'");
  }
};

let e_Contempt = "e_Contempt";
allBlockTypes.push(e_Contempt);
Blockly.Blocks[e_Contempt] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: contempt");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'contempt'");
  }
};

let e_ContentLeft = "e_ContentLeft";
allBlockTypes.push(e_ContentLeft);
Blockly.Blocks[e_ContentLeft] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: content (left)");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'content (left)'");
  }
};

let e_ContentRight = "e_ContentRight";
allBlockTypes.push(e_ContentRight);
Blockly.Blocks[e_ContentRight] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: content (right)");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'content (right)'");
  }
};

let e_Disoriented = "e_Disoriented";
allBlockTypes.push(e_Disoriented);
Blockly.Blocks[e_Disoriented] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: disoriented");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'disoriented'");
  }
};

let e_EcstacyHilarious = "e_EcstacyHilarious";
allBlockTypes.push(e_EcstacyHilarious);
Blockly.Blocks[e_EcstacyHilarious] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: ecstacy hilarious");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'ecstacy hilarious'");
  }
};

let e_EcstacyStarryEyed = "e_EcstacyStarryEyed";
allBlockTypes.push(e_EcstacyStarryEyed);
Blockly.Blocks[e_EcstacyStarryEyed] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: ecstacy starry eyed");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'ecstacy starry eyed'");
  }
};

let e_JoyGoofy = "e_JoyGoofy";
allBlockTypes.push(e_JoyGoofy);
Blockly.Blocks[e_JoyGoofy] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: joy goofy");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'joy goofy'");
  }
};

let e_JoyGoofy2 = "e_JoyGoofy2";
allBlockTypes.push(e_JoyGoofy2);
Blockly.Blocks[e_JoyGoofy2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: joy goofy 2");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'joy goofy 2'");
  }
};

let e_JoyGoofy3 = "e_JoyGoofy3";
allBlockTypes.push(e_JoyGoofy3);
Blockly.Blocks[e_JoyGoofy3] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: joy goofy 3");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'joy goofy 3'");
  }
};

let e_Love = "e_Love";
allBlockTypes.push(e_Love);
Blockly.Blocks[e_Love] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: love");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'love'");
  }
};

let e_Rage = "e_Rage";
allBlockTypes.push(e_Rage);
Blockly.Blocks[e_Rage] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: rage");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'rage'");
  }
};

let e_Rage2 = "e_Rage2";
allBlockTypes.push(e_Rage2);
Blockly.Blocks[e_Rage2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: rage 2");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'rage 2'");
  }
};

let e_Rage3 = "e_Rage3";
allBlockTypes.push(e_Rage3);
Blockly.Blocks[e_Rage3] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: rage 3");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'rage 3'");
  }
};

let e_Rage4 = "e_Rage4";
allBlockTypes.push(e_Rage4);
Blockly.Blocks[e_Rage4] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: rage 4");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'rage 4'");
  }
};

let e_RemorseShame = "e_RemorseShame";
allBlockTypes.push(e_RemorseShame);
Blockly.Blocks[e_RemorseShame] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: remorse shame");
    this.setOutput(true, 'Face');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Represents the facial expression 'remorse shame'");
  }
};

Blockly.Blocks['animation_sleepy.bv'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Animation: Sleeping");
    this.setOutput(true, 'Animation');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Run the animation 'sleepy'");
  }
};

Blockly.Blocks['animation_dancing.bv'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Animation: Dancing");
    this.setOutput(true, 'Animation');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Run the animation 'dancing'");
  }
};

Blockly.Blocks['animation_spooked.bv'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Animation: Spooked");
    this.setOutput(true, 'Animation');
    this.setColour(blockColors["face_category"]["colour"]);
    this.setTooltip("Run the animation 'spooked'");
  }
};

// Audio blocks
let s_Acceptance = "s_Acceptance";
allBlockTypes.push(s_Acceptance);
Blockly.Blocks[s_Acceptance] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: acceptance");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'acceptance'");
  }
};

let s_Amazement = "s_Amazement";
allBlockTypes.push(s_Amazement);
Blockly.Blocks[s_Amazement] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: amazement");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'amazement'");
  }
};

let s_Amazement2 = "s_Amazement2";
allBlockTypes.push(s_Amazement2);
Blockly.Blocks[s_Amazement2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: amazement 2");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'amazement 2'");
  }
};

let s_Anger = "s_Anger";
allBlockTypes.push(s_Anger);
Blockly.Blocks[s_Anger] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: anger");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'anger'");
  }
};

let s_Anger2 = "s_Anger2";
allBlockTypes.push(s_Anger2);
Blockly.Blocks[s_Anger2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: anger 2");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'anger 2'");
  }
};

let s_Anger3 = "s_Anger3";
allBlockTypes.push(s_Anger3);
Blockly.Blocks[s_Anger3] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: anger 3");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'anger 3'");
  }
};

let s_Anger4 = "s_Anger4";
allBlockTypes.push(s_Anger4);
Blockly.Blocks[s_Anger4] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: anger 4");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'anger 4'");
  }
};

let s_Annoyance = "s_Annoyance";
allBlockTypes.push(s_Annoyance);
Blockly.Blocks[s_Annoyance] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: annoyance");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'annoyance'");
  }
};

let s_Annoyance2 = "s_Annoyance2";
allBlockTypes.push(s_Annoyance2);
Blockly.Blocks[s_Annoyance2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: annoyance 2");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'annoyance 2'");
  }
};

let s_Annoyance3 = "s_Annoyance3";
allBlockTypes.push(s_Annoyance3);
Blockly.Blocks[s_Annoyance3] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: annoyance 3");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'annoyance 3'");
  }
};

let s_Annoyance4 = "s_Annoyance4";
allBlockTypes.push(s_Annoyance4);
Blockly.Blocks[s_Annoyance4] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: annoyance 4");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'annoyance 4'");
  }
};

let s_Awe = "s_Awe";
allBlockTypes.push(s_Awe);
Blockly.Blocks[s_Awe] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: awe");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'awe'");
  }
};

let s_Awe2 = "s_Awe2";
allBlockTypes.push(s_Awe2);
Blockly.Blocks[s_Awe2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: awe 2");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'awe 2'");
  }
};

let s_Awe3 = "s_Awe3";
allBlockTypes.push(s_Awe3);
Blockly.Blocks[s_Awe3] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: awe 3");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'awe 3'");
  }
};

let s_Boredom = "s_Boredom";
allBlockTypes.push(s_Boredom);
Blockly.Blocks[s_Boredom] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: boredom");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'boredom'");
  }
};

let s_Disapproval = "s_Disapproval";
allBlockTypes.push(s_Disapproval);
Blockly.Blocks[s_Disapproval] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disapproval");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'disapproval'");
  }
};

let s_Disgust = "s_Disgust";
allBlockTypes.push(s_Disgust);
Blockly.Blocks[s_Disgust] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disgust");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'disgust'");
  }
};

let s_Disgust2 = "s_Disgust2";
allBlockTypes.push(s_Disgust2);
Blockly.Blocks[s_Disgust2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disgust 2");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'disgust 2'");
  }
};

let s_Disgust3 = "s_Disgust3";
allBlockTypes.push(s_Disgust3);
Blockly.Blocks[s_Disgust3] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disgust 3");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'disgust 3'");
  }
};

let s_DisorientedConfused = "s_DisorientedConfused";
allBlockTypes.push(s_DisorientedConfused);
Blockly.Blocks[s_DisorientedConfused] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disoriented confused");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'disoriented confused'");
  }
};

let s_DisorientedConfused2 = "s_DisorientedConfused2";
allBlockTypes.push(s_DisorientedConfused2);
Blockly.Blocks[s_DisorientedConfused2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disoriented confused 2");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'disoriented confused 2'");
  }
};

let s_DisorientedConfused3 = "s_DisorientedConfused3";
allBlockTypes.push(s_DisorientedConfused3);
Blockly.Blocks[s_DisorientedConfused3] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disoriented confused 3");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'disoriented confused 3'");
  }
};

let s_DisorientedConfused4 = "s_DisorientedConfused4";
allBlockTypes.push(s_DisorientedConfused4);
Blockly.Blocks[s_DisorientedConfused4] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disoriented confused 4");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'disoriented confused 4'");
  }
};

let s_DisorientedConfused5 = "s_DisorientedConfused5";
allBlockTypes.push(s_DisorientedConfused5);
Blockly.Blocks[s_DisorientedConfused5] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disoriented confused 5");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'disoriented confused 5'");
  }
};

let s_DisorientedConfused6 = "s_DisorientedConfused6";
allBlockTypes.push(s_DisorientedConfused6);
Blockly.Blocks[s_DisorientedConfused6] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disoriented confused 6");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'disoriented confused 6'");
  }
};

let s_Distraction = "s_Distraction";
allBlockTypes.push(s_Distraction);
Blockly.Blocks[s_Distraction] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: distraction");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'distraction'");
  }
};

let s_Ecstacy = "s_Ecstacy";
allBlockTypes.push(s_Ecstacy);
Blockly.Blocks[s_Ecstacy] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: ecstacy");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'ecstacy'");
  }
};

let s_Ecstacy2 = "s_Ecstacy2";
allBlockTypes.push(s_Ecstacy2);
Blockly.Blocks[s_Ecstacy2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: ecstacy 2");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'ecstacy 2'");
  }
};

let s_Fear = "s_Fear";
allBlockTypes.push(s_Fear);
Blockly.Blocks[s_Fear] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: fear");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'fear'");
  }
};

let s_Grief = "s_Grief";
allBlockTypes.push(s_Grief);
Blockly.Blocks[s_Grief] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: grief");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'grief'");
  }
};

let s_Grief2 = "s_Grief2";
allBlockTypes.push(s_Grief2);
Blockly.Blocks[s_Grief2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: grief 2");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'grief 2'");
  }
};

let s_Grief3 = "s_Grief3";
allBlockTypes.push(s_Grief3);
Blockly.Blocks[s_Grief3] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: grief 3");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'grief 3'");
  }
};

let s_Grief4 = "s_Grief4";
allBlockTypes.push(s_Grief4);
Blockly.Blocks[s_Grief4] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: grief 4");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'grief 4'");
  }
};

let s_Joy = "s_Joy";
allBlockTypes.push(s_Joy);
Blockly.Blocks[s_Joy] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: joy");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'joy'");
  }
};

let s_Joy2 = "s_Joy2";
allBlockTypes.push(s_Joy2);
Blockly.Blocks[s_Joy2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: joy 2");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'joy 2'");
  }
};

let s_Joy3 = "s_Joy3";
allBlockTypes.push(s_Joy3);
Blockly.Blocks[s_Joy3] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: joy 3");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'joy 3'");
  }
};

let s_Joy4 = "s_Joy4";
allBlockTypes.push(s_Joy4);
Blockly.Blocks[s_Joy4] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: joy 4");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'joy 4'");
  }
};

let s_Loathing = "s_Loathing";
allBlockTypes.push(s_Loathing);
Blockly.Blocks[s_Loathing] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: loathing");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'loathing'");
  }
};

let s_Love = "s_Love";
allBlockTypes.push(s_Love);
Blockly.Blocks[s_Love] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: love");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'love'");
  }
};

let s_PhraseByeBye = "s_PhraseByeBye";
allBlockTypes.push(s_PhraseByeBye);
Blockly.Blocks[s_PhraseByeBye] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Bye Bye");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'phrase: Bye Bye'");
  }
};

let s_PhraseEvilAhHa = "s_PhraseEvilAhHa";
allBlockTypes.push(s_PhraseEvilAhHa);
Blockly.Blocks[s_PhraseEvilAhHa] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Evil Ah Ha");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'phrase: Evil Ah Ha'");
  }
};

let s_PhraseHello = "s_PhraseHello";
allBlockTypes.push(s_PhraseHello);
Blockly.Blocks[s_PhraseHello] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Hello");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'phrase: Hello'");
  }
};

let s_PhraseNoNoNo = "s_PhraseNoNoNo";
allBlockTypes.push(s_PhraseNoNoNo);
Blockly.Blocks[s_PhraseNoNoNo] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: No No No");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'phrase: No No No'");
  }
};

let s_PhraseOopsy = "s_PhraseOopsy";
allBlockTypes.push(s_PhraseOopsy);
Blockly.Blocks[s_PhraseOopsy] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Oopsy");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'phrase: Oopsy'");
  }
};

let s_PhraseOwOwOw = "s_PhraseOwOwOw";
allBlockTypes.push(s_PhraseOwOwOw);
Blockly.Blocks[s_PhraseOwOwOw] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Ow Ow Ow");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'phrase: Ow Ow Ow'");
  }
};

let s_PhraseOwwww = "s_PhraseOwwww";
allBlockTypes.push(s_PhraseOwwww);
Blockly.Blocks[s_PhraseOwwww] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Owwww");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'phrase: Owwww'");
  }
};

let s_PhraseUhOh = "s_PhraseUhOh";
allBlockTypes.push(s_PhraseUhOh);
Blockly.Blocks[s_PhraseUhOh] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Uh Oh");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'phrase: Uh Oh'");
  }
};

let s_Rage = "s_Rage";
allBlockTypes.push(s_Rage);
Blockly.Blocks[s_Rage] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: rage");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'rage'");
  }
};

let s_Sadness = "s_Sadness";
allBlockTypes.push(s_Sadness);
Blockly.Blocks[s_Sadness] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'sadness'");
  }
};

let s_Sadness2 = "s_Sadness2";
allBlockTypes.push(s_Sadness2);
Blockly.Blocks[s_Sadness2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness 2");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'sadness 2'");
  }
};

let s_Sadness3 = "s_Sadness3";
allBlockTypes.push(s_Sadness3);
Blockly.Blocks[s_Sadness3] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness 3");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'sadness 3'");
  }
};

let s_Sadness4 = "s_Sadness4";
allBlockTypes.push(s_Sadness4);
Blockly.Blocks[s_Sadness4] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness 4");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'sadness 4'");
  }
};

let s_Sadness5 = "s_Sadness5";
allBlockTypes.push(s_Sadness5);
Blockly.Blocks[s_Sadness5] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness 5");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'sadness 5'");
  }
};

let s_Sadness6 = "s_Sadness6";
allBlockTypes.push(s_Sadness6);
Blockly.Blocks[s_Sadness6] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness 6");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'sadness 6'");
  }
};

let s_Sadness7 = "s_Sadness7";
allBlockTypes.push(s_Sadness7);
Blockly.Blocks[s_Sadness7] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness 7");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'sadness 7'");
  }
};

let s_Sleepy = "s_Sleepy";
allBlockTypes.push(s_Sleepy);
Blockly.Blocks[s_Sleepy] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sleepy");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'sleepy'");
  }
};

let s_Sleepy2 = "s_Sleepy2";
allBlockTypes.push(s_Sleepy2);
Blockly.Blocks[s_Sleepy2] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sleepy 2");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'sleepy 2'");
  }
};

let s_Sleepy3 = "s_Sleepy3";
allBlockTypes.push(s_Sleepy3);
Blockly.Blocks[s_Sleepy3] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sleepy 3");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'sleepy 3'");
  }
};

let s_Sleepy4 = "s_Sleepy4";
allBlockTypes.push(s_Sleepy4);
Blockly.Blocks[s_Sleepy4] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sleepy 4");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'sleepy 4'");
  }
};

let s_SleepySnore = "s_SleepySnore";
allBlockTypes.push(s_SleepySnore);
Blockly.Blocks[s_SleepySnore] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sleepy snore");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'sleepy snore'");
  }
};

let s_SystemCameraShutter = "s_SystemCameraShutter";
allBlockTypes.push(s_SystemCameraShutter);
Blockly.Blocks[s_SystemCameraShutter] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: system camera shutter");
    this.setOutput(true, 'Audio');
    this.setColour(blockColors["audio_category"]["colour"]);
    this.setTooltip("Represents the audio 'system camera shutter'");
  }
};

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(
    [addText]);

export const blockTypes = allBlockTypes;
