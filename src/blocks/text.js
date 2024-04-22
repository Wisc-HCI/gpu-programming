/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

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
Blockly.Blocks["ChangeLED"] = {
  init: function () {
    this.setColour('260'); // set color 
    this.appendValueInput("FIELD_ChangeLED")
      .setCheck("Colour")
      .appendField("Change the LED color to");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setOutput(false);
    this.setTooltip("Changes Misty's LED to a specified color");
  }
};

Blockly.Blocks["TransitionLED"] = {
  init: function () {
    this.setColour('260');
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
      .appendField(new Blockly.FieldNumber(1000), "FIELD_TransitionTime_TimeMs")
      .appendField("ms");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Transition LED between two colors with the specified transition type and time.");
  }
};

// Blockly.Blocks["TransitionLED"] = {
//   init: function () {
//     this.setColour('260');
//     this.appendValueInput("COLOR1")
//       .setCheck("Colour")
//       .appendField("Transition LED from");
//     this.appendValueInput("COLOR2")
//       .setCheck("Colour")
//       .appendField("to");
//     this.appendDummyInput()
//       .appendField("using the")
//       .appendField(new Blockly.FieldDropdown([
//         ["Breathe", "BREATHE"],
//         ["Blink", "BLINK"],
//         ["Transition Once", "TRANSITION_ONCE"]
//       ]), "TRANSITION_TYPE")
//       .appendField("transition for a duration of")
//       .appendField(new Blockly.FieldNumber(100), "FIELD_TransitionTime_TimeMs")
//       .appendField("ms");
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setTooltip("Transition LED between two colors with the specified transition type and time.");
//   }
// };

Blockly.Blocks["DisplayImage"] = {
  init: function () {
    this.setColour('260');
    this.appendValueInput("FIELD_DisplayImage_Filename")
      .setCheck("Face")
      .appendField("Change face expression to: ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Displays an image on Misty's screen, Alpha specifies transparency (0 is completely transparent, 1 is completely opaque) ***WARNING: MUST connect with ListFilesAvailable to select the image file to display***");
  }
};

Blockly.Blocks["MoveHead"] = {
  init: function () {
    this.setColour('260');
    this.appendDummyInput()
      .appendField("Move head")
      .appendField(new Blockly.FieldDropdown([["Up", "U"], ["Down", "D"]]), "FIELD_MoveHead_Pitch")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Moves Misty's head Up or Down");
    this.setHelpUrl("MoveHead");
  }
};

Blockly.Blocks["MoveHead2"] = {
  init: function () {
    this.setColour('260');
    this.appendDummyInput()
      .appendField("Move head")
      .appendField("Pitch (-40 to 25):")
      .appendField(new Blockly.FieldNumber(0, -40, 25, 1), "FIELD_MoveHead_Pitch")
      .appendField("Roll (-42 to 42):")
      .appendField(new Blockly.FieldNumber(0, -42, 42, 1), "FIELD_MoveHead_Roll")
      .appendField("Yaw (-90 to 90):")
      .appendField(new Blockly.FieldNumber(0, -90, 90, 1), "FIELD_MoveHead_Yaw")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Moves Misty's head a specified amount of degrees with roll, pitch, and/or yaw");
    this.setHelpUrl("MoveHead");
  }
};





Blockly.Blocks["MoveArm"] = {
  init: function () {
    this.setColour('260');
    this.appendDummyInput()
      .appendField("Move ")
      .appendField(new Blockly.FieldDropdown([["Right", "Right"], ["Left", "Left"]]), "FIELD_MoveArm_Arm")
      .appendField("arm to position")
      .appendField(new Blockly.FieldNumber(0, -90, 90, 1), "FIELD_MoveArm_Position")
      .appendField("at a speed of (0 to 100)")
      .appendField(new Blockly.FieldNumber(50, 0, 100, 1), "FIELD_MoveArm_Velocity");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Moves one of Misty's arms to a specified position (expects a value from 0-10, 5 points the arm straight forward) at a specified speed (between 0 and 100)");
    this.setHelpUrl("MoveArm");
  }
};

Blockly.Blocks["MoveArm2"] = {
  init: function () {
    this.setColour('260');
    this.appendDummyInput()
      .appendField("Move both arms to position")
      .appendField(new Blockly.FieldNumber(0), "FIELD_MoveArm2_Position")
      .appendField("at a speed of (0 to 100)")
      .appendField(new Blockly.FieldNumber(50, 0, 100, 1), "FIELD_MoveArm2_Velocity");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Moves both of Misty's arms to a specified position (expects a value from 0-10, 5 points the arm straight forward) at a specified speed (between 0 and 100)");
    this.setHelpUrl("MoveArm2");
  }
};

Blockly.Blocks["MoveArms"] = {
  init: function () {
    this.setColour('260');
    this.appendDummyInput()
      .appendField("Move left arm to position")
      .appendField(new Blockly.FieldNumber(0, -29, 90, 1), "FIELD_MoveArm_LeftPosition")
      .appendField("at a speed of (0 to 100)")
      .appendField(new Blockly.FieldNumber(50, 0, 100, 1), "FIELD_MoveArm_LeftVelocity")
      .appendField("and move right arm to position")
      .appendField(new Blockly.FieldNumber(0, -29, 90, 1), "FIELD_MoveArm_RightPosition")
      .appendField("at a speed of (0 to 100)")
      .appendField(new Blockly.FieldNumber(50, 0, 100, 1), "FIELD_MoveArm_RightVelocity");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Moves both of Misty's arms to a specified position (expects a value from 0-10, 5 points the arm straight forward) at a specified speed (between 0 and 100)");
    this.setHelpUrl("MoveArms");
  }
};
Blockly.Blocks["MoveArms2"] = {
  init: function () {
    var shadowBlock_1 = this.workspace.newBlock('math_number');
    shadowBlock_1.setShadow(true);
    shadowBlock_1.initSvg();
    shadowBlock_1.render();
    var lPosBlock = shadowBlock_1.outputConnection;

    var shadowBlock_2 = this.workspace.newBlock('math_number');
    shadowBlock_2.setShadow(true);
    shadowBlock_2.initSvg();
    shadowBlock_2.render();
    var lVelBlock = shadowBlock_2.outputConnection;

    var shadowBlock_3 = this.workspace.newBlock('math_number');
    shadowBlock_3.setShadow(true);
    shadowBlock_3.initSvg();
    shadowBlock_3.render();
    var rPosBlock = shadowBlock_3.outputConnection;

    var shadowBlock_4 = this.workspace.newBlock('math_number');
    shadowBlock_4.setShadow(true);
    shadowBlock_4.initSvg();
    shadowBlock_4.render();
    var rVelBlock = shadowBlock_4.outputConnection;

    this.setColour('260');
    this.appendValueInput("FIELD_MoveArm_LeftPosition").setCheck('Number')
      .appendField("Move left arm to position");
    var shadowBlockConnectionLPosition = this.getInput("FIELD_MoveArm_LeftPosition").connection;
    shadowBlockConnectionLPosition.connect(lPosBlock);
    this.appendValueInput("FIELD_MoveArm_LeftVelocity").setCheck('Number')
      .appendField("at a speed of (0 to 100)");
    var shadowBlockConnectionLVelocity = this.getInput("FIELD_MoveArm_LeftVelocity").connection;
    shadowBlockConnectionLVelocity.connect(lVelBlock);
    this.appendValueInput("FIELD_MoveArm_RightPosition").setCheck('Number')
      .appendField("and move right arm to position");
    var shadowBlockConnectionRPosition = this.getInput("FIELD_MoveArm_RightPosition").connection;
    shadowBlockConnectionRPosition.connect(rPosBlock);
    this.appendValueInput("FIELD_MoveArm_RightVelocity").setCheck('Number')
      .appendField("at a speed of (0 to 100)");
    var shadowBlockConnectionLVelocity = this.getInput("FIELD_MoveArm_RightVelocity").connection;
    shadowBlockConnectionLVelocity.connect(rVelBlock);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Moves both of Misty's arms to a specified position (expects a value from 0-10, 5 points the arm straight forward) at a specified speed");
    this.setHelpUrl("MoveArms");
  }
};

Blockly.Blocks["DriveTime"] = {
  init: function () {
    this.setColour('260');
    this.appendDummyInput()
      .appendField("Move ")
      .appendField(new Blockly.FieldDropdown([["Forward", "F"], ["Backward", "B"]]), "FIELD_DriveTime_Direction")
      .appendField("at a speed of (0 to 100)")
      .appendField(new Blockly.FieldNumber(25, 0, 100, 1), "FIELD_DriveTime_Velocity")
      .appendField("for a duration of")
      .appendField(new Blockly.FieldNumber(1500, 100, 10000, 100), "FIELD_DriveTime_TimeMs")
      .appendField("ms");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Drives Misty straight in a specified direction at a specified speed for a specified amount of time (1000ms = 1 second)");
    this.setHelpUrl("DriveTime");
  }
};

Blockly.Blocks["MoveHead3"] = {

  init: function () {
    var shadowBlock_1 = this.workspace.newBlock('math_number');
    shadowBlock_1.setShadow(true);
    shadowBlock_1.initSvg();
    shadowBlock_1.render();
    var pitchBlock = shadowBlock_1.outputConnection;

    var shadowBlock_2 = this.workspace.newBlock('math_number');
    shadowBlock_2.setShadow(true);
    shadowBlock_2.initSvg();
    shadowBlock_2.render();
    var rollBlock = shadowBlock_2.outputConnection;

    var shadowBlock_3 = this.workspace.newBlock('math_number');
    shadowBlock_3.setShadow(true);
    shadowBlock_3.initSvg();
    shadowBlock_3.render();
    var yawBlock = shadowBlock_3.outputConnection;

    var shadowBlock_4 = this.workspace.newBlock('math_number');
    shadowBlock_4.setShadow(true);
    shadowBlock_4.initSvg();
    shadowBlock_4.render();
    var timeBlock = shadowBlock_4.outputConnection;

    this.setColour('260');

    this.appendValueInput("FIELD_MoveHead_Pitch").setCheck('Number')
      .appendField("Move head")
      .appendField("Pitch (-40 to 25):");
    var shadowBlockConnectionPitch = this.getInput("FIELD_MoveHead_Pitch").connection;
    shadowBlockConnectionPitch.connect(pitchBlock);

    this.appendValueInput("FIELD_MoveHead_Roll").setCheck('Number')
      .appendField("Roll (-42 to 42):");
    var shadowBlockConnectionRoll = this.getInput("FIELD_MoveHead_Roll").connection;
    shadowBlockConnectionRoll.connect(rollBlock);

    this.appendValueInput("FIELD_MoveHead_Yaw").setCheck('Number')
      .appendField("Yaw (-90 to 90):");
    var shadowBlockConnectionYaw = this.getInput("FIELD_MoveHead_Yaw").connection;
    shadowBlockConnectionYaw.connect(yawBlock);

    this.appendValueInput("FIELD_MoveHead_Time").setCheck('Number')
      .appendField("Time (0 to 60 seconds):");
    var shadowBlockConnectionTime = this.getInput("FIELD_MoveHead_Time").connection;
    shadowBlockConnectionTime.connect(timeBlock);

    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Moves Misty's head a specified amount of degrees with roll, pitch, and/or yaw");
    this.setHelpUrl("MoveHead");
  }
};


Blockly.Blocks["DriveTime2"] = {
					
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

    this.setColour('260');
    this.appendValueInput("FIELD_DriveTime_Velocity").setCheck('Number')
      .appendField("Move at a speed of (-100 to 100)");
    var shadowBlockConnectionVelocity = this.getInput("FIELD_DriveTime_Velocity").connection;
    shadowBlockConnectionVelocity.connect(velocityBlock);
    this.appendValueInput("FIELD_DriveTime_Angular").setCheck('Number')
      .appendField("with angular velocity of (-100 CW to 100 CCW)");
    var shadowBlockConnectionAngular = this.getInput("FIELD_DriveTime_Angular").connection;
    shadowBlockConnectionAngular.connect(angularBlock);
    this.appendValueInput("FIELD_DriveTime_TimeMs").setCheck('Number')
      .appendField("for a duration of (ms)");
    var shadowBlockConnectionTime = this.getInput("FIELD_DriveTime_TimeMs").connection;
    shadowBlockConnectionTime.connect(timeBlock);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Drives Misty forward (positive speed) or backward (negative speed) with possible turning using angular velocity (0 for straight) for the specified duration (1000 ms = 1 second)");
    this.setHelpUrl("DriveTime");
  }
};

Blockly.Blocks["Turn"] = {
  init: function () {
    this.setColour('260');
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
    this.setHelpUrl("Turn");
  }
};

Blockly.Blocks["Turn2"] = {
  init: function () {
    var shadowBlock_1 = this.workspace.newBlock('math_number');
    shadowBlock_1.setShadow(true);
    shadowBlock_1.initSvg();
    shadowBlock_1.render();
    var timeBlock = shadowBlock_1.outputConnection;

    this.setColour('260');
    this.appendDummyInput()
      .appendField("Turn")
      .appendField(new Blockly.FieldDropdown([["Left", "L"], ["Right", "R"]]), "FIELD_Turn_Direction");
    this.appendValueInput("FIELD_Turn_Duration").setCheck('Number')
      .appendField("for time of");
      var shadowBlockConnectionTime = this.getInput("FIELD_Turn_Duration").connection;
      shadowBlockConnectionTime.connect(timeBlock);
    this.appendDummyInput()
      .appendField("milliseconds");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Turns Misty in the specified direction (1000ms = 1 second and 4500ms is approximately 90 degrees)");
    this.setHelpUrl("Turn");
  }
};

Blockly.Blocks['Test'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Test');
    this.setColour(230);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};

Blockly.Blocks["Speak"] = {
  init: function () {
    this.setColour('260');
    this.appendValueInput("FIELD_Speak_Text")
      .setCheck("String")
      .appendField("Speak: ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Speak given input text");
  }
};

// TODO: Add another Speak block with a dropdown with defaults: “Hi”, “Hello”, etc.
Blockly.Blocks["SpeakDefault"] = {
  init: function () {
    this.setColour('260');
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

Blockly.Blocks["TurnOnFlashlight"] = {
  init: function () {
    this.setColour('260');
    this.appendDummyInput()
      .appendField("Turn on flashlight ")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Turn on flashlight");
  }
};

Blockly.Blocks["TurnOffFlashlight"] = {
  init: function () {
    this.setColour('260');
    this.appendDummyInput()
      .appendField("Turn off flashlight ")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Turn off flashlight");
  }
};

Blockly.Blocks["WaitForSeconds"] = {
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
    this.setColour(260);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};


Blockly.Blocks["PlayAudio"] = {
  init: function () {
    this.setColour('260');
    this.appendValueInput("FIELD_PlayAudio_Filename")
      .setCheck("Audio")
      .appendField("Play audio: ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
  }
};

Blockly.Blocks["DisplayText"] = {
  init: function () {
    this.setColour('260');
    this.appendDummyInput()
      .appendField("Display Text: ")
      .appendField(new Blockly.FieldTextInput("default"), "FIELD_DisplayText_Text");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
  }
};

// Face blocks
Blockly.Blocks['eyes_acceptance'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: acceptance");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'acceptance'");
  }
};

Blockly.Blocks['eyes_admiration'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: admiration");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'admiration'");
  }
};

Blockly.Blocks['eyes_amazement'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: amazement");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'amazement'");
  }
};

Blockly.Blocks['eyes_anger'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: anger");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'anger'");
  }
};

Blockly.Blocks['eyes_annoyed'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: annoyed");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'annoyed'");
  }
};

Blockly.Blocks['eyes_anticipation'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: anticipation");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'anticipation'");
  }
};

Blockly.Blocks['eyes_apprehension'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: apprehension");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'apprehension'");
  }
};

Blockly.Blocks['eyes_boredom'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: boredom");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'boredom'");
  }
};

Blockly.Blocks['eyes_default'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: default");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'default'");
  }
};

Blockly.Blocks['eyes_disgust'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: disgust");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'disgust'");
  }
};

Blockly.Blocks['eyes_distraction'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: distraction");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'distraction'");
  }
};

Blockly.Blocks['eyes_ecstasy_frame_1'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: ecstasy 1");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'ecstasy 1'");
  }
};

Blockly.Blocks['eyes_ecstasy_frame_2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: ecstasy 2");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'ecstasy 2'");
  }
};

Blockly.Blocks['eyes_fear'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: fear");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'fear'");
  }
};

Blockly.Blocks['eyes_grief'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: grief");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'grief'");
  }
};

Blockly.Blocks['eyes_interest'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: interest");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'interest'");
  }
};

Blockly.Blocks['eyes_joy'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: joy");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'joy'");
  }
};

Blockly.Blocks['eyes_loathing'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: loathing");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'loathing'");
  }
};

Blockly.Blocks['eyes_pensiveness'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: pensiveness");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'pensiveness'");
  }
};

Blockly.Blocks['eyes_rage'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: rage eyes");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'rage eyes'");
  }
};

Blockly.Blocks['eyes_sad'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: sad");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'sad'");
  }
};

Blockly.Blocks['eyes_serenity'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: serenity");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'serenity'");
  }
};

Blockly.Blocks['eyes_surprise'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: surprise");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'surprise'");
  }
};

Blockly.Blocks['eyes_terror'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: terror");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'terror'");
  }
};

Blockly.Blocks['eyes_trust'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: trust");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'trust'");
  }
};

Blockly.Blocks['eyes_vigilance'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: vigilance");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'vigilance'");
  }
};

Blockly.Blocks['e_Sleeping'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: sleeping");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'sleeping'");
  }
};

Blockly.Blocks['e_SleepingZZZ'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: sleeping ZZZ");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'sleeping ZZZ'");
  }
};

Blockly.Blocks['e_Contempt'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: contempt");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'contempt'");
  }
};

Blockly.Blocks['e_ContentLeft'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: content (left)");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'content (left)'");
  }
};

Blockly.Blocks['e_ContentRight'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: content (right)");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'content (right)'");
  }
};

Blockly.Blocks['e_Disoriented'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: disoriented");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'disoriented'");
  }
};

Blockly.Blocks['e_EcstacyHilarious'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: ecstacy hilarious");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'ecstacy hilarious'");
  }
};

Blockly.Blocks['e_EcstacyStarryEyed'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: ecstacy starry eyed");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'ecstacy starry eyed'");
  }
};

Blockly.Blocks['e_JoyGoofy'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: joy goofy");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'joy goofy'");
  }
};

Blockly.Blocks['e_JoyGoofy2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: joy goofy 2");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'joy goofy 2'");
  }
};

Blockly.Blocks['e_JoyGoofy3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: joy goofy 3");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'joy goofy 3'");
  }
};

Blockly.Blocks['e_Love'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: love");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'love'");
  }
};

Blockly.Blocks['e_Rage'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: rage");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'rage'");
  }
};

Blockly.Blocks['e_Rage2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: rage 2");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'rage 2'");
  }
};

Blockly.Blocks['e_Rage3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: rage 3");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'rage 3'");
  }
};

Blockly.Blocks['e_Rage4'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: rage 4");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'rage 4'");
  }
};

Blockly.Blocks['e_RemorseShame'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Expression: remorse shame");
    this.setOutput(true, 'Face');
    this.setColour(240);
    this.setTooltip("Represents the facial expression 'remorse shame'");
  }
};

// Audio blocks
Blockly.Blocks['s_Acceptance'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: acceptance");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'acceptance'");
  }
};

Blockly.Blocks['s_Amazement'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: amazement");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'amazement'");
  }
};

Blockly.Blocks['s_Amazement2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: amazement 2");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'amazement 2'");
  }
};

Blockly.Blocks['s_Anger'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: anger");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'anger'");
  }
};

Blockly.Blocks['s_Anger2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: anger 2");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'anger 2'");
  }
};

Blockly.Blocks['s_Anger3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: anger 3");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'anger 3'");
  }
};

Blockly.Blocks['s_Anger4'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: anger 4");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'anger 4'");
  }
};

Blockly.Blocks['s_Annoyance'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: annoyance");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'annoyance'");
  }
};

Blockly.Blocks['s_Annoyance2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: annoyance 2");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'annoyance 2'");
  }
};

Blockly.Blocks['s_Annoyance3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: annoyance 3");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'annoyance 3'");
  }
};

Blockly.Blocks['s_Annoyance4'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: annoyance 4");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'annoyance 4'");
  }
};

Blockly.Blocks['s_Awe'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: awe");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'awe'");
  }
};

Blockly.Blocks['s_Awe2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: awe 2");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'awe 2'");
  }
};

Blockly.Blocks['s_Awe3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: awe 3");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'awe 3'");
  }
};

Blockly.Blocks['s_Boredom'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: boredom");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'boredom'");
  }
};

Blockly.Blocks['s_Disapproval'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disapproval");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'disapproval'");
  }
};

Blockly.Blocks['s_Disgust'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disgust");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'disgust'");
  }
};

Blockly.Blocks['s_Disgust2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disgust 2");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'disgust 2'");
  }
};

Blockly.Blocks['s_Disgust3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disgust 3");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'disgust 3'");
  }
};

Blockly.Blocks['s_DisorientedConfused'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disoriented confused");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'disoriented confused'");
  }
};

Blockly.Blocks['s_DisorientedConfused2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disoriented confused 2");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'disoriented confused 2'");
  }
};

Blockly.Blocks['s_DisorientedConfused3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disoriented confused 3");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'disoriented confused 3'");
  }
};

Blockly.Blocks['s_DisorientedConfused4'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disoriented confused 4");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'disoriented confused 4'");
  }
};

Blockly.Blocks['s_DisorientedConfused5'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disoriented confused 5");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'disoriented confused 5'");
  }
};

Blockly.Blocks['s_DisorientedConfused6'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: disoriented confused 6");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'disoriented confused 6'");
  }
};

Blockly.Blocks['s_Distraction'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: distraction");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'distraction'");
  }
};

Blockly.Blocks['s_Ecstacy'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: ecstacy");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'ecstacy'");
  }
};

Blockly.Blocks['s_Ecstacy2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: ecstacy 2");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'ecstacy 2'");
  }
};

Blockly.Blocks['s_Fear'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: fear");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'fear'");
  }
};

Blockly.Blocks['s_Grief'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: grief");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'grief'");
  }
};

Blockly.Blocks['s_Grief2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: grief 2");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'grief 2'");
  }
};

Blockly.Blocks['s_Grief3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: grief 3");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'grief 3'");
  }
};

Blockly.Blocks['s_Grief4'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: grief 4");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'grief 4'");
  }
};

Blockly.Blocks['s_Joy'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: joy");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'joy'");
  }
};

Blockly.Blocks['s_Joy2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: joy 2");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'joy 2'");
  }
};

Blockly.Blocks['s_Joy3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: joy 3");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'joy 3'");
  }
};

Blockly.Blocks['s_Joy4'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: joy 4");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'joy 4'");
  }
};

Blockly.Blocks['s_Loathing'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: loathing");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'loathing'");
  }
};

Blockly.Blocks['s_Love'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: love");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'love'");
  }
};

Blockly.Blocks['s_PhraseByeBye'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Bye Bye");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'phrase: Bye Bye'");
  }
};

Blockly.Blocks['s_PhraseEvilAhHa'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Evil Ah Ha");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'phrase: Evil Ah Ha'");
  }
};

Blockly.Blocks['s_PhraseHello'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Hello");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'phrase: Hello'");
  }
};

Blockly.Blocks['s_PhraseNoNoNo'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: No No No");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'phrase: No No No'");
  }
};

Blockly.Blocks['s_PhraseOopsy'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Oopsy");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'phrase: Oopsy'");
  }
};

Blockly.Blocks['s_PhraseOwOwOw'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Ow Ow Ow");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'phrase: Ow Ow Ow'");
  }
};

Blockly.Blocks['s_PhraseOwwww'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Owwww");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'phrase: Owwww'");
  }
};

Blockly.Blocks['s_PhraseUhOh'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: Uh Oh");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'phrase: Uh Oh'");
  }
};

Blockly.Blocks['s_Rage'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: rage");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'rage'");
  }
};

Blockly.Blocks['s_Sadness'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'sadness'");
  }
};

Blockly.Blocks['s_Sadness2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness 2");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'sadness 2'");
  }
};

Blockly.Blocks['s_Sadness3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness 3");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'sadness 3'");
  }
};

Blockly.Blocks['s_Sadness4'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness 4");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'sadness 4'");
  }
};

Blockly.Blocks['s_Sadness5'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness 5");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'sadness 5'");
  }
};

Blockly.Blocks['s_Sadness6'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness 6");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'sadness 6'");
  }
};

Blockly.Blocks['s_Sadness7'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sadness 7");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'sadness 7'");
  }
};

Blockly.Blocks['s_Sleepy'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sleepy");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'sleepy'");
  }
};

Blockly.Blocks['s_Sleepy2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sleepy 2");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'sleepy 2'");
  }
};

Blockly.Blocks['s_Sleepy3'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sleepy 3");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'sleepy 3'");
  }
};

Blockly.Blocks['s_Sleepy4'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sleepy 4");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'sleepy 4'");
  }
};

Blockly.Blocks['s_SleepySnore'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: sleepy snore");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'sleepy snore'");
  }
};

Blockly.Blocks['s_SystemCameraShutter'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Sound: system camera shutter");
    this.setOutput(true, 'Audio');
    this.setColour(240);
    this.setTooltip("Represents the audio 'system camera shutter'");
  }
};

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(
    [addText]);
