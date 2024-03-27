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
    this.appendDummyInput() // format input
      .appendField("Change the LED color to")
      .appendField(new Blockly.FieldColour("#FF0000"), "FIELD_ChangeLED");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setOutput(false);
    this.setTooltip("Changes Misty's LED to a specified color");
  }
};

Blockly.Blocks["DisplayImage"] = {
  init: function () {
    this.setColour('260');
    this.appendDummyInput()
      .appendField("Change face expression to: ")
      .appendField(new Blockly.FieldTextInput("default"), "FIELD_DisplayImage_Filename");
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
      .appendField(new Blockly.FieldNumber(0, 0, 10, 1), "FIELD_MoveArm_Position")
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
    this.appendDummyInput()
      .appendField("Speak: ")
      .appendField(new Blockly.FieldTextInput("default"), "FIELD_Speak_Filename");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Speak given input text");
  }
};
Blockly.Blocks["TurnOnFlashlight"] = {
  init: function () {
    this.setColour('260');
    this.appendDummyInput()
      .appendField("Turn on Flashlight ")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Turn on Flashlight");
  }
};
Blockly.Blocks["TurnOffFlashlight"] = {
  init: function () {
    this.setColour('260');
    this.appendDummyInput()
      .appendField("Turn off Flashlight ")
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Turn off Flashlight");
  }
};
Blockly.Blocks["PlayAudio"] = {
  init: function () {
    this.setColour('260');
    this.appendDummyInput()
      .appendField("Play audio: ")
      .appendField(new Blockly.FieldTextInput("default"), "FIELD_PlayAudio_Filename");
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
      .appendField(new Blockly.FieldTextInput("default"), "FIELD_DisplayText_Filename");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("");
  }
};

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(
    [addText]);
