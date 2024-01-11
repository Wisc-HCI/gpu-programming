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

// List of hard coded commands 
// *IMPORTANT* any new custom commands will also need to be added here
var hardCodedCommands = {
	"AudioListDropdown": null,
	"BrowseToAudioFile": null,
	"BrowseToImageFile": null,
	"DisplayImage": {
		"RelatedCommand": "GetImageList",
		"Category": "Assets",
		"RelatedEndpoint": "images"
	},
	"ChangeLED": null,
	"DeleteAudioAsset": {
		"RelatedCommand": "GetAudioList",
		"Category": "Assets",
		"RelatedEndpoint": "audio"
	},
	"DeleteImageAsset": {
		"RelatedCommand": "GetImageList",
		"Category": "Assets",
		"RelatedEndpoint": "images"
	},
	"DriveTime": null,
	"DriveTime2": null,
	"GetAudioList": null,
	"GetImageList": null,
	"GetLogFile": null,
	"ImageListDropdown": null,
	"MoveArm": null,
	"MoveArm2": null,
	"MoveArms" : null,	//added smh, 11/11/2020
	"MoveArms2" : null,	//added smh, 11/11/2020
	"MoveHead": null,

	"MoveHead2": null,
	"MoveHead3": null,
	"PauseCode": null,
	"PlayAudioClip": {
		"RelatedCommand": "GetAudioList",
		"Category": "Assets",
		"RelatedEndpoint": "audio"
	},
	"SaveAudio": {
		"RelatedCommand": "GetAudioList",
		"Category": "Assets",
		"RelatedEndpoint": "audio"
	},
	"SaveImage": {
		"RelatedCommand": "GetImageList",
		"Category": "Assets",
		"RelatedEndpoint": "images"
	},
	"GetSlamPath": null,
	"Speak": null,
	"Speak2": null,
	"Turn": null,
	"Turn2": null
};

/**
 * legacyBlocks
 * Responsible for the hard-coded blocks
 * @param {Object} block object with attributes for arguments, category, command category, endpoint, and name.
 * @param {String} blockName name of block.
 * @param {block} newBlock object containing attributes that specify the blockName and set disabled equal to false.
 * @param {array} args list of arguments.
 * @param {int} colour RGB value for colour of block.
 * @param {String} endpoint point of entry on robot.
 * @private
 * 
 * GENERIC TEMPLATE FOR LEGACY BLOCK: 
 *********************************************************************************************************************************************************************************
 * case "DriveTime":
 * 
 *	   // Initialize fieldValues as an empty array
 *     var fieldValues = [];
 *     
 *     // Append arguments to the array of fieldValues
 *     for (var z = 0; z < args.length; z++) {
 *	       fieldValues.push(fieldValue + "_" + args[z].Name);
 *	   }
 *	   
 *	   // Set up the format of the block in the Blocky IDE
 *	   Blockly.Blocks["DriveTime"] = {
 *	       init: function () {
 *			   
 *			   // Set the colour of this block
 *	           this.setColour(colour);
 *	           
 *	           // Append a dummy input row
 *	           // This example dummy input looks like "Move [FIELD_DriveTime_Direction] at a speed of [FIELD_DriveTime_Velocity] (0 to 100) for a duration of [FIELD_DriveTime_TimeMs] ms"
 *	           this.appendDummyInput()
 *				   // Append a field to this input
 *	               .appendField("Move ")
 *	               
 *	               // Append a dropdown field to this input 
 *	               // This example field is named FIELD_DriveTime_Direction so it can be referenced later
 *	               .appendField(new Blockly.FieldDropdown([["Forward", "F"], ["Backward", "B"], ["Left", "L"], ["Right", "R"]]), "FIELD_DriveTime_Direction")
 *	               
 *	               // Append a field to this input
 *	               .appendField("at a speed of")
 *	               
 *	               // Append a number field to this input
 *	               // This example field is named FIELD_DriveTime_Velocity so it can be referenced later
 *	               .appendField(new Blockly.FieldNumber(25, 0, 100, 1), "FIELD_DriveTime_Velocity")
 *	               
 *	               // Append a field to this input
 *	               .appendField("(0 to 100) for a duration of")
 *	               
 *	               // Append a number field to this input
 *	               // This example field is named FIELD_DriveTime_TimeMs so it can be referenced later
 *	               .appendField(new Blockly.FieldNumber(500, 100, 10000, 100), "FIELD_DriveTime_TimeMs")
 *	               
 *	               // Append a field to this input
 *	               .appendField("ms");
 *	               
 *	           // Set whether this block can chain onto the bottom another block
 *	           this.setPreviousStatement(true, null);
 *	           
 *	           // Set whether another block can chain onto the bottom of this block
 *	           this.setNextStatement(true, null);
 *	           
 *	           // Set the message displayed by this block's tooltip
 *	           this.setTooltip("DriveTime");
 *	           
 *	           // Set the url of this block's help page
 *	           this.setHelpUrl("DriveTime");
 *	           
 *	           // TODO: find DriveTime help page in Misty Blockly documentation and link to it with setHelpUrl() and test
 *	           
 *	       }
 *	   };
 *	   
 *	   // Give the block functionality
 *	   Blockly.JavaScript["DriveTime"] = function (block) {
 *	   
 *		   // Store the value of the field labeled FIELD_DriveTime_Direction
 *	       var direction = block.getFieldValue("FIELD_DriveTime_Direction");
 *	       
 *	       // Store the value of the field labeled FIELD_DriveTime_Velocity
 *	       // Before doing so, this value is converted from a string to an integer
 *	       var velocity = parseInt(block.getFieldValue("FIELD_DriveTime_Velocity"));
 *	       
 *	       // Store the value of the field labeled FIELD_DriveTime_TimeMs
 *	       // Before doing so, this value is converted from a string to an integer
 *	       var time = parseInt(block.getFieldValue("FIELD_DriveTime_TimeMs"));
 *	       
 *	       // Initialize a payload
 *	       var payload = null;
 *	       
 *	       // If the direction is "L" for Left or "R" for Right
 *	       //     If the direction is "L"
 *	       //         Set the angularVelocity equal to positive velocity
 *	       //     Else (direction is "R")
 *	       //         Set the angularVelocity equal to negative velocity
 *	       // Else (direction is not "L" or "R")
 *	       //     Set angularVelocity to 0
 *	       var angularVelocity = direction === "L" || direction === "R" ? (direction === "L" ? velocity : -velocity) : 0;
 *	       
 *	       // If the angularVelocity is 0
 *	       //     If the direction is "F" for Forward
 *	       //         Set the linearVelocity equal to positive velocity
 *	       //     Else (direction is "B" for Backwards)
 *	       //         Set the linearVelocity equal to negative velocity
 *	       // Else (angularVelocity is not 0)
 *	       //     Set linearVelocity to 0
 *	       var linearVelocity = angularVelocity === 0 ? (direction === "F" ? velocity : -velocity) : 0;
 *	       
 *	       // Set the payload to an object with attributes for linearVelocity, angularVelocity, and timeMs
 *	       payload = {
 *	           "LinearVelocity": linearVelocity,	//-100 - 100
 *	           "AngularVelocity": angularVelocity,	//-100 - 100
 *	           "TimeMs": time						//Milliseconds
 *	       };
 *	       
 *	       // Use stringify to make a string representation of the payload
 *	       // Concatenate a JavaScript command as a string, using the robot's endpoint and ip address and the payload
 *	       // The definition of sendPostRequestToRobot() can be found under misty_ajax.js
 *	       var code = "sendPostRequestToRobot(\"" + endpoint + "\",\"" + ip + "\"," + JSON.stringify(payload) + ");";
 *	       
 *	       // Return the string of request to the robot
 *	       return code;
 *	   };
 *	   break;
 ********************************************************************************************************************************************************************************* 
 */
 function legacyBlocks(block, blockName, newBlock, args, colour, endpoint, level) {
	let fieldValue = "FIELD_" + blockName;
	switch (blockName) {
		///////////////////////
		// Change LED
		///////////////////////
		case "ChangeLED":
			// Declare list of arguments the block will use, if any
			args = ["Red", "Green", "Blue"]
			// Set up the format of the block in the Blocky IDE
			Blockly.Blocks["ChangeLED"] = {
				init: function () {
					this.setColour(colour); // set color 
					this.appendDummyInput() // format input
						.appendField("Change the LED color to")
						.appendField(new Blockly.FieldColour("#FF0000"), fieldValue);
					this.setPreviousStatement(true, null);
					this.setNextStatement(true, null);
					this.setOutput(false);
					this.setTooltip("Changes Misty's LED to a specified color");
				}
			};
			// Give the block functionality
			Blockly.JavaScript["ChangeLED"] = function (block) {
				const payload = {};
				// For each argument, get the current value in the corresponding field and append it to the payload
				for (var arg of args) {
					var input = block.getFieldValue("FIELD_ChangeLED");
					payload[arg] = hexToRgb(input)[arg];
				} 
				// Tell the robot what to do based on the payload
				var code = "sendPostRequestToRobot(\"" + endpoint + "\",\"" + ip + "\"," + JSON.stringify(payload) + ");";
				return code;
			};

			break;
		///////////////////////
		// Get Image List
		///////////////////////
		case "GetImageList":
			// Set up the format of the block in the Blocky IDE
			Blockly.Blocks[blockName] = {
				init: function () {
					updateImageList(); 
					this.setColour(colour);
					this.appendDummyInput()
						.appendField("List of image files available:")
						.appendField(new Blockly.FieldDropdown(listOfImages), fieldValue);
					this.setPreviousStatement(false, null);
					this.setNextStatement(false, null);
					this.setOutput(true);
					this.setTooltip("Allows you to choose from list of image files available on the Misty. ***NOTE: must connect to Misty to populate pulldown.");
				}
			};
			// Give the block functionality
			Blockly.JavaScript[blockName] = function (block) {
			};
			break;
		///////////////////////
		// Get Audio List
		///////////////////////
		case "GetAudioList":
			Blockly.Blocks[blockName] = {
				init: function () {
					updateAudioList(); 
					this.setColour(colour);
					this.appendDummyInput()
						.appendField("List of audio files available:")
						.appendField(new Blockly.FieldDropdown(listOfAudioFiles), fieldValue);
					this.setPreviousStatement(false, null);
					this.setNextStatement(false, null);
					this.setOutput(true);
					this.setTooltip("Allows you to choose from list of audio files available on the Misty. ***NOTE: must connect to Misty to populate pulldown.");
				}
			};
			Blockly.JavaScript[blockName] = function (block) {
			};
			break;
		///////////////////////
		// Get Log File
		///////////////////////
		case "GetLogFile":
			Blockly.Blocks[blockName] = {
				init: function () {
					updateImageList();
					this.setColour(colour);
					this.appendDummyInput()
						.appendField("Get log file for date: ")
						.appendField(new Blockly.FieldTextInput("YYYY/MM/DD"), "FIELD_GetLogFile_Date");
					this.setPreviousStatement(false, null);
					this.setNextStatement(false, null);
					this.setOutput(true);
					this.setTooltip(blockName);
				}
			};
			Blockly.JavaScript[blockName] = function (block) {
				const payload = {};
				var arg = args[0].Name;
				var input = block.getFieldValue("FIELD_GetLogFile_Date");
				var code = "sendGetRequestToRobot(\"" + endpoint + "?date=" + input + "\",\"" + ip + "\"," + JSON.stringify(payload) + ");";
				return code;
			};
			break;
		///////////////////////
		// Display Image
		///////////////////////
		case "DisplayImage":


			Blockly.Blocks[blockName] = {
				init: function () {
					this.setColour(colour);
					let valueInput = this.appendValueInput(fieldValue);
					let check = "FIELD_" + hardCodedCommands[blockName].RelatedCommand;
					valueInput.setCheck(check)
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(blockName);
					this.setPreviousStatement(true, null);
					this.setNextStatement(true, null);
					this.setTooltip("Displays an image on Misty's screen, Alpha specifies transparency (0 is completely transparent, 1 is completely opaque) ***WARNING: MUST connect with ListFilesAvailable to select the image file to display***");
					this.setHelpUrl(blockName);
				}
			};
		
			Blockly.JavaScript[blockName] = function (block) {
				var alpha = 1
				var payload = {
					"FileName": block.childBlocks_[0].inputList[0].fieldRow[1].value_,
					"Alpha": alpha
					
				};
				var code = "sendPostRequestToRobot(\"" + endpoint + "\",\"" + ip + "\"," + JSON.stringify(payload) + ");";
				return code;
			};

			
			break;
		///////////////////////
		// Play Audio Clip
		///////////////////////
		case "PlayAudioClip":
			Blockly.Blocks[blockName] = {
				init: function () {
					this.setColour(colour);
					let valueInput = this.appendValueInput(fieldValue);
					let check = "FIELD_" + hardCodedCommands[blockName].RelatedCommand;
                    valueInput.setCheck(check)
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(blockName)
                        .appendField("at volume (0-100):  ")
                        .appendField(new Blockly.FieldNumber(100, 0, 100, 1), "FIELD_PlayAudioClip_Volume");
					this.setPreviousStatement(true, null);
					this.setNextStatement(true, null);
					this.setTooltip("Plays an audio file that is already loaded on Misty at a specified volume ***WARNING: MUST connect with ListFilesAvailable or GetListOfAudioClips block to select the audio file to play***");
					this.setHelpUrl(blockName);
				}
			};
			
		
			Blockly.JavaScript[blockName] = function (block) {
				var payload = {
					"AssetId": block.childBlocks_[0].inputList[0].fieldRow[1].value_,
					"Volume": parseFloat(block.getFieldValue("FIELD_PlayAudioClip_Volume"))
				};
				var code = "sendPostRequestToRobot(\"" + endpoint + "\",\"" + ip + "\"," + JSON.stringify(payload) + ");";
				return code;
			};
			break;
		///////////////////////
		// Delete Image Asset
		///////////////////////
		case "DeleteImageAsset":
			Blockly.Blocks[blockName] = {
				init: function () {
					this.setColour(colour);
					let valueInput = this.appendValueInput(fieldValue);
					let check = "FIELD_" + hardCodedCommands[blockName].RelatedCommand;
					valueInput.setCheck(check)
						.setAlign(Blockly.ALIGN_RIGHT)
						.appendField(blockName);
					this.setPreviousStatement(true, null);
					this.setNextStatement(true, null);
					this.setTooltip(blockName);
					this.setHelpUrl(blockName);
				}
			};
			Blockly.JavaScript[blockName] = function (block) {
				let payload = {};
				var arg = args[0].Name;
				var input = block.childBlocks_[0].inputList[0].fieldRow[1].value_;
				payload[arg] = input;
				if (SystemImageList.includes(input)) {
					showToastMessage("Sorry, this appears to be a system file. Only user added files can be deleted!");
					return;
				}
				else {
					var code = "sendDeleteRequestToRobot(\"" + endpoint + "?FileName="+ encodeURI(input) + "\",\"" + ip + "\");";
					return code;
				}			
			};
			break;
		///////////////////////
		// Delete Audio
		///////////////////////
		case "DeleteAudio":
			Blockly.Blocks[blockName] = {
				init: function () {
					this.setColour(colour);
					let valueInput = this.appendValueInput(fieldValue);
					let check = "FIELD_" + hardCodedCommands[blockName].RelatedCommand;
					valueInput.setCheck(check)
						.setAlign(Blockly.ALIGN_RIGHT)
						.appendField(blockName);
					this.setPreviousStatement(true, null);
					this.setNextStatement(true, null);
					this.setTooltip(blockName);
					this.setHelpUrl(blockName);
				}
			};
			Blockly.JavaScript[blockName] = function (block) {
				const payload = {};
				var arg = args[0].Name;
				var input = block.childBlocks_[0].inputList[0].fieldRow[1].value_;
				payload[arg] = input;
				if (!input.includes(".")) {
					showToastMessage("Sorry, this appears to be a system file. Only user added files can be deleted!");
					return;
				}
				else {
					var code = "sendDeleteRequestToRobot(\"" + endpoint + "?FileName="+ encodeURI(input) + "\",\"" + ip + "\");";
					return code;
				}
			};
			break;
		///////////////////////
		// Drive Time
		///////////////////////
		case "DriveTime":
			var fieldValues = [];
			for (var z = 0; z < args.length; z++) {
				fieldValues.push(fieldValue + "_" + args[z].Name);
			}
			Blockly.Blocks["DriveTime"] = {
				init: function () {
					this.setColour(colour);
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

			Blockly.JavaScript["DriveTime"] = function (block) {
				var direction = block.getFieldValue("FIELD_DriveTime_Direction");
				var velocity = parseInt(block.getFieldValue("FIELD_DriveTime_Velocity"));
				var time = parseInt(block.getFieldValue("FIELD_DriveTime_TimeMs"));				
				var linearVelocity = direction === "F" ? velocity : -velocity;
				let payload = '{"LinearVelocity":'+linearVelocity+',"AngularVelocity":0,"TimeMs":'+time+'}';
				var code = 'sendPostRequestToRobot("' + endpoint + '","' + ip + '",' + payload + ');'+delayJS(time+500);
				return code;
			};
			break;
		///////////////////////
		// Drive Time 2
		///////////////////////
		case "DriveTime2":
				var fieldValues = [];


				for (var z = 0; z < args.length; z++) {
					fieldValues.push(fieldValue + "_" + args[z].Name);
				}
				

				// Second version of DriveTime, called DriveTime2, with puzzle pieces

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

						this.setColour(colour);
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
			
				Blockly.JavaScript["DriveTime2"] = function (block) {
	
					var linearVelocity = Blockly.JavaScript.valueToCode(block, "FIELD_DriveTime_Velocity", Blockly.JavaScript.ORDER_ATOMIC);
					var angularVelocity = Blockly.JavaScript.valueToCode(block, "FIELD_DriveTime_Angular", Blockly.JavaScript.ORDER_ATOMIC);
					var time = Blockly.JavaScript.valueToCode(block, "FIELD_DriveTime_TimeMs", Blockly.JavaScript.ORDER_ATOMIC);
					let payload = '{"LinearVelocity":'+linearVelocity+',"AngularVelocity":'+angularVelocity+',"TimeMs":'+time+'}';
					var code = 'sendPostRequestToRobot("' + endpoint + '","' + ip + '",' + payload + ');'+delayJS(time+'+500');
					return code;
				};
			break;
		///////////////////////
		// Turn
		///////////////////////
		case "Turn":
			var fieldValues = [];
			for (var z = 0; z < args.length; z++) {
				fieldValues.push(fieldValue + "_" + args[z].Name);
			}
			Blockly.Blocks["Turn"] = {
				init: function () {
					this.setColour(colour);
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

			Blockly.JavaScript["Turn"] = function (block) {
				var direction = block.getFieldValue("FIELD_Turn_Direction");
				var time = parseInt(block.getFieldValue("FIELD_Turn_Duration"));		
				var angularVelocity = 100;
				var linearVelocity = 0;
				var degree = direction === "L" ? 90 : -90;
				let payload = '{"LinearVelocity":'+linearVelocity+',"AngularVelocity":'+angularVelocity+',"TimeMs":'+time+',"Degree":'+degree+'}';
				var code = 'sendPostRequestToRobot("' + endpoint + '","' + ip + '",' + payload + ');'+delayJS(time+'+500');
				return code;
			};
			break;
		///////////////////////
		// Turn 2
		///////////////////////
		case "Turn2":
			var fieldValues = [];
			for (var z = 0; z < args.length; z++) {
				fieldValues.push(fieldValue + "_" + args[z].Name);
			}
			Blockly.Blocks["Turn2"] = {
				init: function () {
					var shadowBlock_1 = this.workspace.newBlock('math_number');
					shadowBlock_1.setShadow(true);
					shadowBlock_1.initSvg();
					shadowBlock_1.render();
					var timeBlock = shadowBlock_1.outputConnection;

					this.setColour(colour);
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

			Blockly.JavaScript["Turn2"] = function (block) {
				var direction = block.getFieldValue("FIELD_Turn_Direction");
				var time = Blockly.JavaScript.valueToCode(block, "FIELD_Turn_Duration", Blockly.JavaScript.ORDER_ATOMIC);		
				var angularVelocity = 100;
				var linearVelocity = 0;
				var degree = direction === "L" ? 90 : -90;
				let payload = '{"LinearVelocity":'+linearVelocity+',"AngularVelocity":'+angularVelocity+',"TimeMs":'+time+',"Degree":'+degree+'}';
				var code = 'sendPostRequestToRobot("' + endpoint + '","' + ip + '",' + payload + ');'+delayJS(time+'+500');
				return code;
			};
			break;
		///////////////////////
		// Pause Code
		///////////////////////
		case "PauseCode":
			Blockly.Blocks["PauseCode"] = {
				init: function () {
					this.appendDummyInput()
						.appendField("Pause for a duration of")
						.appendField(new Blockly.FieldNumber(500, 100, 10000, 100), "FIELD_PauseCode_Duration")
						.appendField("ms");
					this.setInputsInline(true);
					this.setPreviousStatement(true, null);
					this.setNextStatement(true, null);
					this.setColour(colour);
					this.setTooltip("Pauses code for set amount of time (1000ms = 1 second)");
					this.setHelpUrl("PauseCode");
				}
			};

			Blockly.JavaScript["PauseCode"] = function (block) {
				var pauseDuration = Number(block.getFieldValue("FIELD_PauseCode_Duration"));
				var code = delayJS(pauseDuration);
				return code;
			};
			break;
		///////////////////////
		// Get Slam Path
		///////////////////////
		case "GetSlamPath":
			Blockly.Blocks[blockName] = {
				init: function () {
					this.setColour(colour);
					this.appendDummyInput()
						.appendField("ALPHA - " + blockName)
						.appendField(new Blockly.FieldNumber(0, 0, null, 1), "X")
						.appendField(new Blockly.FieldNumber(0, 0, null, 1), "Y");
					this.setPreviousStatement(true, null);
					this.setNextStatement(true, null);
					this.setTooltip(blockName);
					this.setHelpUrl(blockName);
				}
			};
			Blockly.JavaScript["GetSlamPath"] = function (block) {
				var payload = {
					"X": parseInt(block.getFieldValue("X")),
					"Y": parseInt(block.getFieldValue("Y"))
				};
				var code = "sendPostRequestToRobot(\"SlamGetPath\",\"" + ip + "\"," + JSON.stringify(payload) + ");";
				return code;
			};
			break;
		///////////////////////
		// Move Head
		///////////////////////
		case "MoveHead":
			Blockly.Blocks["MoveHead"] = {
				init: function () {
					this.setColour(colour);
					this.appendDummyInput()
						.appendField("Move head")
						.appendField(new Blockly.FieldDropdown([["Up", "U"], ["Down", "D"]]), "FIELD_MoveHead_Pitch")
					this.setPreviousStatement(true, null);
					this.setNextStatement(true, null);
					this.setTooltip("Moves Misty's head Up or Down");
					this.setHelpUrl("MoveHead");
				}
			};
			Blockly.JavaScript["MoveHead"] = function (block) {
				var pitch = block.getFieldValue("FIELD_MoveHead_Pitch") === "D" ? 5 : -5;
				var velocity = parseInt(block.getFieldValue("FIELD_MoveHead_Velocity"));
				var payload = null;
				payload = {
					"Pitch": pitch,		//-5 - 5
					"Yaw": 0,											
					"Roll": 0,
					"Units": "position" 
				};
				var code = "sendPostRequestToRobot(\"" + endpoint + "\",\"" + ip + "\"," + JSON.stringify(payload) + ");";
				return code;
			};
			break;
		///////////////////////
		// Move Head 2
		///////////////////////
		case "MoveHead2":
			Blockly.Blocks["MoveHead2"] = {
				init: function () {
					this.setColour(colour);
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
			Blockly.JavaScript["MoveHead2"] = function (block) {
				var pitch, roll, yaw;

				pitch = block.getFieldValue("FIELD_MoveHead_Pitch");
				roll = block.getFieldValue("FIELD_MoveHead_Roll");
				yaw = block.getFieldValue("FIELD_MoveHead_Yaw");
			
				let payload = '{"Pitch":'+pitch+',"Yaw":'+yaw+',"Roll":'+roll+',"Units": "degrees"}';
				var code = "sendPostRequestToRobot(\"" + endpoint + "\",\"" + ip + "\"," + payload + ");";
				return code;
			};
			break;
		///////////////////////
		// Move Head 3
		///////////////////////
		case "MoveHead3":
			
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


				this.setColour(colour);
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
			Blockly.JavaScript["MoveHead3"] = function (block) {
				var pitch, roll, yaw;
				
				pitch = Blockly.JavaScript.valueToCode(block, "FIELD_MoveHead_Pitch", Blockly.JavaScript.ORDER_ATOMIC);
				roll = Blockly.JavaScript.valueToCode(block, "FIELD_MoveHead_Roll", Blockly.JavaScript.ORDER_ATOMIC);
				yaw = Blockly.JavaScript.valueToCode(block, "FIELD_MoveHead_Yaw", Blockly.JavaScript.ORDER_ATOMIC);

				let payload = '{"Pitch":'+pitch+',"Yaw":'+yaw+',"Roll":'+roll+',"Units": "degrees"}';
				var code = "sendPostRequestToRobot(\"" + endpoint + "\",\"" + ip + "\"," + payload + ");";
				return code;
			};
			break;
		///////////////////////
		// Move Arm
		///////////////////////
		case "MoveArm":
			Blockly.Blocks["MoveArm"] = {
				init: function () {
					this.setColour(colour);
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
			Blockly.JavaScript["MoveArm"] = function (block) {
				var arm = block.getFieldValue("FIELD_MoveArm_Arm") === "Right" ? "Right" : "Left";
				var position = parseInt(block.getFieldValue("FIELD_MoveArm_Position"));
				var velocity = parseInt(block.getFieldValue("FIELD_MoveArm_Velocity"));
		
				let payload = '{"Arm":'+"\""+arm+"\""+',"Position":'+position+',"Velocity":'+velocity+',"Units":"Position"}'
				var code = "sendPostRequestToRobot(\"" + endpoint + "\",\"" + ip + "\"," + payload + ");";
				return code;
			};
			break;
		///////////////////////
		// Move Arm 2
		///////////////////////
		case "MoveArm2":
			Blockly.Blocks["MoveArm2"] = {
				init: function () {
					var shadowBlock_1 = this.workspace.newBlock('math_number');
					shadowBlock_1.setShadow(true);
					shadowBlock_1.initSvg();
					shadowBlock_1.render();
					var positionBlock = shadowBlock_1.outputConnection;

					var shadowBlock_2 = this.workspace.newBlock('math_number');
					shadowBlock_2.setShadow(true);
					shadowBlock_2.initSvg();
					shadowBlock_2.render();
					var velocityBlock = shadowBlock_2.outputConnection;

					this.setColour(colour);
					this.appendDummyInput()
						.appendField("Move ")
						.appendField(new Blockly.FieldDropdown([["Right", "Right"], ["Left", "Left"]]), "FIELD_MoveArm_Arm");
					this.appendValueInput("FIELD_MoveArm_Position").setCheck('Number')
						.appendField("arm to position");
					var shadowBlockConnectionPosition = this.getInput("FIELD_MoveArm_Position").connection;
					shadowBlockConnectionPosition.connect(positionBlock);
					this.appendValueInput("FIELD_MoveArm_Velocity").setCheck('Number')
						.appendField("at a speed of (0 to 100)");
					var shadowBlockConnectionVelocity = this.getInput("FIELD_MoveArm_Velocity").connection;
					shadowBlockConnectionVelocity.connect(velocityBlock);
					this.setInputsInline(true);
					this.setPreviousStatement(true, null);
					this.setNextStatement(true, null);
					this.setTooltip("Moves one of Misty's arms to a specified position (expects a value from 0-10, 5 points the arm straight forward) at a specified speed");
					this.setHelpUrl("MoveArm");
				}
			};
			Blockly.JavaScript["MoveArm2"] = function (block) {
				var arm = block.getFieldValue("FIELD_MoveArm_Arm") === "Right" ? "Right" : "Left";
				var position = Blockly.JavaScript.valueToCode(block, "FIELD_MoveArm_Position", Blockly.JavaScript.ORDER_ATOMIC);
				var velocity = Blockly.JavaScript.valueToCode(block, "FIELD_MoveArm_Velocity", Blockly.JavaScript.ORDER_ATOMIC);
				let payload = '{"Arm":'+"\""+arm+"\""+',"Position":'+position+',"Velocity":'+velocity+',"Units":"Position"}'
				var code = "sendPostRequestToRobot(\"" + endpoint + "\",\"" + ip + "\"," + payload + ");";
				return code;
			};
			break;
		///////////////////////
		// Move Arms
		///////////////////////
		case "MoveArms":
			Blockly.Blocks["MoveArms"] = {
				init: function () {
					this.setColour(colour);
					this.appendDummyInput()
						.appendField("Move left arm to position")
						.appendField(new Blockly.FieldNumber(0, 0, 10, 1), "FIELD_MoveArm_LeftPosition")
						.appendField("at a speed of (0 to 100)")
						.appendField(new Blockly.FieldNumber(50, 0, 100, 1), "FIELD_MoveArm_LeftVelocity")
						.appendField("and move right arm to position")
						.appendField(new Blockly.FieldNumber(0, 0, 10, 1), "FIELD_MoveArm_RightPosition")
						.appendField("at a speed of (0 to 100)")
						.appendField(new Blockly.FieldNumber(50, 0, 100, 1), "FIELD_MoveArm_RightVelocity");
					this.setPreviousStatement(true, null);
					this.setNextStatement(true, null);
					this.setTooltip("Moves both of Misty's arms to a specified position (expects a value from 0-10, 5 points the arm straight forward) at a specified speed (between 0 and 100)");
					this.setHelpUrl("MoveArms");
				}
			};
			Blockly.JavaScript["MoveArms"] = function (block) {
				var left_position = parseInt(block.getFieldValue("FIELD_MoveArm_LeftPosition"));
				var left_velocity = parseInt(block.getFieldValue("FIELD_MoveArm_LeftVelocity"));
				var right_position = parseInt(block.getFieldValue("FIELD_MoveArm_LeftPosition"));
				var right_velocity = parseInt(block.getFieldValue("FIELD_MoveArm_LeftVelocity"));
				let payload = '{"LeftArmPosition":'+left_position+',"RightArmPosition":'+right_position+',"LeftArmVelocity":'+left_velocity+',"RightArmVelocity":'+right_velocity+',"Units": "Position"}'
				var code = "sendPostRequestToRobot(\"" + endpoint + "\",\"" + ip + "\"," + payload + ");";
				return code;
			};
			break;
		///////////////////////
		// Move Arms 2
		///////////////////////
		case "MoveArms2":
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

					this.setColour(colour);
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
			Blockly.JavaScript["MoveArms2"] = function (block) {
				var left_position = Blockly.JavaScript.valueToCode(block, "FIELD_MoveArm_LeftPosition", Blockly.JavaScript.ORDER_ATOMIC);
				var left_velocity = Blockly.JavaScript.valueToCode(block, "FIELD_MoveArm_LeftVelocity", Blockly.JavaScript.ORDER_ATOMIC);
				var right_position = Blockly.JavaScript.valueToCode(block, "FIELD_MoveArm_RightPosition", Blockly.JavaScript.ORDER_ATOMIC);
				var right_velocity = Blockly.JavaScript.valueToCode(block, "FIELD_MoveArm_RightVelocity", Blockly.JavaScript.ORDER_ATOMIC);
				let payload = '{"LeftArmPosition":'+left_position+',"RightArmPosition":'+right_position+',"LeftArmVelocity":'+left_velocity+',"RightArmVelocity":'+right_velocity+',"Units": "Position"}'
				var code = "sendPostRequestToRobot(\"" + endpoint + "\",\"" + ip + "\"," + payload + ");";
				return code;
			};
			break;
		///////////////////////
		// Browse to Image File
		///////////////////////
		case "BrowseToImageFile":
		///////////////////////
		// Browse to Audio File
		///////////////////////
		case "BrowseToAudioFile":
			Blockly.Blocks[blockName] = {
				init: function () {
					this.setColour(colour);
					var dummy = this.appendDummyInput("")
						.setAlign(Blockly.ALIGN_RIGHT);
					if (blockName === "BrowseToImageFile") {
						dummy.appendField(new Blockly.FieldCheckbox(false, openImageFilePicker), "FIELD_BrowseToImageFile_Boolean");
					} else {
						dummy.appendField(new Blockly.FieldCheckbox(false, openAudioFilePicker), "FIELD_BrowseToAudioFile_Boolean");
					}
					dummy.appendField(blockName)
						.appendField(new Blockly.FieldLabel(""), "FIELD_BrowseToFile_Data");
					this.setOutput(true, blockName);
					this.setColour(colour);
					//this.setTooltip("Checkbox opens up file explorer to find a file you would like to access");
					var name = newBlock;
					if (blockName === "BrowseToImageFile") {
						this.setHelpUrl("Image File");
						this.setTooltip("Checkbox opens up file explorer to find an image file you would like to access. Connect with Save image file to robot to save that specified file to the Misty.");
					} else {
						this.setHelpUrl("Audio File");
						this.setTooltip("Checkbox opens up file explorer to find an audio file you would like to access. Connect with Save audio file to robot to save that specified file to the Misty.");
					}
				}
			};
			break;
		///////////////////////
		// Save Audio
		///////////////////////
		case "SaveAudio":
		///////////////////////
		// Save Image
		///////////////////////
		case "SaveImage":
		///////////////////////
		// Save Asset
		///////////////////////
		case "SaveAsset":
			Blockly.Blocks[blockName] = {
				init: function () {
					this.setColour(colour);
					var valueInput = this.appendValueInput(fieldValue);
					if (blockName === "SaveImage") {
						valueInput.setCheck("BrowseToImageFile");
						valueInput.setAlign(Blockly.ALIGN_RIGHT)
						.appendField("Save image file to robot");
						this.setTooltip("Saves an image file to the robot");
					} else {
						valueInput.setCheck("BrowseToAudioFile");
						valueInput.setAlign(Blockly.ALIGN_RIGHT)
						.appendField("Save audio file to robot");
						this.setTooltip("Saves an audio file to the robot");
					}
					
					this.setPreviousStatement(true, null);
					this.setNextStatement(true, null);
					//this.setTooltip("Save file to robot");
					this.setHelpUrl("SaveFileToRobot");
				}
			};
			Blockly.JavaScript[blockName] = function (block) {
				var code;
				var input = block.childBlocks_[0]["id"];
				var payload = {};
				for (u = 0; u < listOfFilesReadIn.length; u++) {
					var browseBlockIdOfFile = listOfFilesReadIn[u].blockId;
					if (input === browseBlockIdOfFile) {
						payload = listOfFilesReadIn[u];
						payload["ImmediatelyApply"] = false;
					}
				}
			}
			break;
		///////////////////////
		// Speak
		///////////////////////
		case "Speak":

			Blockly.Blocks[blockName] = {
				init: function () {
					this.appendDummyInput()
						.appendField("Say:")
						.appendField(new Blockly.FieldTextInput("Hello, world!"), "speak_string");
					this.appendDummyInput()
						.appendField("at a volume of ")
						.appendField(new Blockly.FieldDropdown([["default","default"],["x-low","x-low"],["low","low"],["medium","medium"],["loud","loud"],["x-loud","x-loud"]]), "FIELD_volume_setting");
					this.appendDummyInput()
						.appendField("at a pitch of ")
						.appendField(new Blockly.FieldDropdown([["default","default"],["x-low","x-low"],["low","low"],["medium","medium"],["high","high"],["x-high","x-high"]]), "FIELD_pitch_setting");
					this.appendDummyInput()
						.appendField("at a rate of ")
						.appendField(new Blockly.FieldDropdown([["default","default"],["x-slow", "x-slow"],["slow", "slow"],["medium","medium"],["fast","fast"],["x-fast","x-fast"]]), "FIELD_rate_setting");
					this.setInputsInline(false);  // smh - put parameters on separate lines
					this.setPreviousStatement(true, null);
					this.setNextStatement(true, null);
					this.setColour(colour);
					this.setTooltip("Enter something you want Misty to say. ***NOTE: This command is currently in Alpha, meaning it is still under development, and may not work as expected at all times.***");
					this.setHelpUrl("");
				}
			};
	
			Blockly.JavaScript[blockName] = function (block) {
				var text_speak_string = block.getFieldValue('speak_string');

				// NOTE: the Speak API is still in alpha and only works when the text-to-speech module loads
				//		 If it doesn't work, you need to reboot the robot. Repeat until you hear something when you run the speak block
				var volume = block.getFieldValue('FIELD_volume_setting'); // extra low volume setting so that Misty doesn't yell like she normally does when she talk
				var pitch = block.getFieldValue('FIELD_pitch_setting');
				var rate = block.getFieldValue('FIELD_rate_setting');
				//var lang = block.getFieldValue('FIELD_lang_setting');
				var payload = {
					"Text": "<speak><prosody volume='"+volume+"' pitch='"+pitch+"' rate='"+rate+"'>"+text_speak_string+"</prosody></speak>", 
					"Flush": false,
					"UtteranceId": "First"
				};
				var code = "sendPostRequestToRobot(\"" + endpoint + "\",\"" + ip + "\"," + JSON.stringify(payload) + ");";

				return code;
			}
			break;
		///////////////////////
        // Speak 2
        ///////////////////////
        case "Speak2":
            Blockly.Blocks[blockName] = {
                init: function() {
                this.appendDummyInput()
                    .appendField("Say:")
                    .appendField(new Blockly.FieldVariable("speak_string", null, ['String'], 'String'), "FIELD_Speak_String_Variable");
                this.appendDummyInput()
                    .appendField("at a volume of ")
                    .appendField(new Blockly.FieldDropdown([["default","default"],["x-low","x-low"],["low","low"],["medium","medium"],["loud","loud"],["x-loud","x-loud"]]), "FIELD_volume_setting");
                this.appendDummyInput()
                    .appendField("at a pitch of ")
                    .appendField(new Blockly.FieldDropdown([["default","default"],["x-low","x-low"],["low","low"],["medium","medium"],["high","high"],["x-high","x-high"]]), "FIELD_pitch_setting");
                this.appendDummyInput()                   
                    .appendField("at a rate of ")
                    .appendField(new Blockly.FieldDropdown([["default","default"],["x-slow", "x-slow"],["slow", "slow"],["medium","medium"],["fast","fast"],["x-fast","x-fast"]]), "FIELD_rate_setting");
                this.setInputsInline(false);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(colour);
                this.setTooltip("Enter something you want Misty to say. ***NOTE: This command is currently in Alpha, meaning it is still underdeveloped, and may not work as expected at all times.***");
                this.setHelpUrl("");
                }
            };
            Blockly.JavaScript[blockName] = function(block) {
                var text_speak_string = block.getFieldValue('FIELD_Speak_String_Variable');   
                var volume = block.getFieldValue('FIELD_volume_setting'); // extra low volume setting so that Misty doesn't yell like she normally does when she talk
                var pitch = block.getFieldValue('FIELD_pitch_setting');
                var rate = block.getFieldValue('FIELD_rate_setting');
                let payload = '{"Text": "<speak><prosody volume='+"'"+volume+"' pitch='"+pitch+"' rate='"+rate+"'>"+'"+'+text_speak_string+'+"</prosody></speak>","Flush":'+false+',"UtteranceId": "First"}';
                var code = "sendPostRequestToRobot(\"" + endpoint + "\",\"" + ip + "\"," + payload + ");";
                return code;
            }
			break;		
	}
}

/**
 * addBlock
 * Adds a block to Blockly based on a command
 * @param {Object} commandObject contains information about a command for a block that is to be added.
 * @param {category} categoryTab the specific tab where this new block belongs
 * @param {int} colour the colour of the block.
 * @private
 */
function addBlock(commandObject, categoryTab, colour, level) {
	// The first block to get added is BrowseToImageFile from my testing
	// This is where we initialize tools the things we need the first block to get added
	var legacyCommands = Object.keys(hardCodedCommands);
	var blockName = commandObject.Name;
	var endpoint = commandObject.Endpoint;
	var commandCategory = commandObject.CommandCategory;
	var requestType = commandObject.RequestType;
	var args = commandObject.Arguments;
	var newBlock = document.createElement("block");

	newBlock.setAttribute("type", blockName);
	newBlock.setAttribute("disabled", false);
	categoryTab.appendChild(newBlock);

	// This is where the magic happens and new blocks actually get added other than those already contained in Blockly Blocks, Variables, and Functions or Legacy Blocks
	
	legacyBlocks(commandObject, blockName, newBlock, args, colour, endpoint, level);
		
	
}
/**
 * constructCommandObjects
 * Create command objects with the details needed to create blockly blocks
 * @param {Object} commands contains all the different API commands according to their type (ie delete, get, post, put).
 * @param {Function} callback callback function.
 * @private
 */
function constructCommandObjects(commands, callback, level) {

	// contains type of request as the key for each of the API commands available
	var commandsByRequestType = {
		"POST": commands.post,
		"DELETE": commands.delete,
		"PUT": commands.put,
		"GET": commands.get,
	};

	var commandObjects = [];	// holds each of the Blockly block's Misty commands (format shown below)
	/**************************
	 * Category
	 * Name
	 * Endpoint
	 * Arguments
	 * CommandCategory
	 * RequestType
	 *************************/

	for (var key in commandsByRequestType) {	// key is the request type (ie POST, DELETE, PUT, GET)
		var sublist = commandsByRequestType[key];	// array containing each of the API commands for the current key
		for (var x = 0; x < sublist.length; x++) {
			let thisCommand = sublist[x];
			
				if (implemented.includes(thisCommand.baseApiCommand)) {
					// This is where the commands are put into each of the blockly blocks
					let commandObject = {
						"Category": thisCommand.apiCommand.apiCommandGroup,
						"Name": thisCommand.apiCommand.name,
						"Endpoint": thisCommand.endpoint,
						"Arguments": thisCommand.apiCommand.arguments,
						"CommandCategory": thisCommand.apiCommand.category,
						"RequestType": key
					};
					commandObjects.push(commandObject);
				}
			
		}
	}
	parseArguments(commandObjects, callback);
}

/**
 * parseArguments
 * Breaks apart the Misty commands and converts them into a usable format within the Blockly blocks
 * @param {array} commandObjects contains all the information for the Blockly blocks and each of the Misty commands they contain
 * @param {Function} callback callback function.
 * @private
 */
function parseArguments(commandObjects, callback) {
	commandObjects.forEach(function (command) {
		if (command.Arguments) {
			var commandArguments = command.Arguments;	// the current command we want to parse
			var argNames = Object.keys(commandArguments); 	// stores the current Misty command name (eg. "volume" for the command to set volume)
			var argArray = Array.from(argNames, x => commandArguments[x]);		// stores the details related to the current command
			var args = [];
			argArray.forEach(function (arg) {
				let type = "";
				var bTypes = Object.keys(blocklyTypes(0,0,0));		// gets the different types of variables that go into fields of Blockly boxes from blocklyTypes function
				for (i=0; i < bTypes.length; i++) {
					if (arg["getValueType"].indexOf(bTypes[i]) > -1)
					{
						type = bTypes[i];
						break;
					}
				};
				arg["getValueType"].substring(arg["getValueType"].lastIndexOf("System.") + 7, arg["getValueType"].indexOf(","));
				// this is what allows the user to enter in appropriate values for the different Misty commands in Blockly
				let argument = {
					"Name": arg.name,
					"Type": type,
					"Value": arg.Value
				};
				args.push(argument);	// keeps a running array of each of these commands in this new user friendly format
			});
			command.Arguments = args; 	// updates command.Arguments to hold the Misty commands in this new format to be used by the Blockly interface
		}
	});
	callback(commandObjects);
}

/**
 * constructCategories
 * Create an array of categories, each containing an array of its commands
 * @param {array} commnadObjects contains all of the Misty commands and the Blockly block they belong to.
 * @private
 */
function constructCategories(commandObjects, level) {
	var commandGroupOfEachCommand = commandObjects.map(x => x.Category);
	var commandGroups = [];
	var categoryArray = [];

	for (const key of commandGroupOfEachCommand) {
		if (!commandGroups[key]) {
			commandGroups[key] = new Array;
			categoryArray.push(key);
		}
	}

	for (var i = 0; i < categoryArray.length; i++) {
		for (var j = 0; j < commandObjects.length; j++) {
			commandObjects[j].Category === categoryArray[i] ? commandGroups[categoryArray[i]].push(commandObjects[j]) : null;
		}
	}
	updateMistyBlocks(commandGroups, categoryArray, level);
}

/**
 * updateMistyBlocks
 * Adds tabs and blocks to the blockly toolbox and displays the blocks in the browser
 * @param {array} commandGroups 2D array of Blockly command objects.
 * @param {array} categories contains all Blockly blocks that we wish to display.
 */

function updateMistyBlocks(commandGroups, categories, level) {
	var colours = ["#339933", "#FBBD0B", "#D11149", "#4285F4", "#990099", "#6B09EE", "#F17105", "#1A8FE3", "#9966FF"];
	var blocklyColours = [153, 45, 344, 218, 344, 266, 28, 206, 260];
	var usedColors = []; 

	while (toolbox.childNodes[7]) {
		toolbox.removeChild(toolbox.childNodes[7]);
	}
	for (var i = 0; i < categories.length; i++) {
		var categoryTab = document.createElement("category");
		categoryTab.setAttribute("name", categories[i]);
		switch(categories[i]){
			case 'Assets':
				categoryTab.setAttribute("colour", colours[0]);
				usedColors.push(blocklyColours[0]);
				break;
			case 'Movement':
				categoryTab.setAttribute("colour", colours[1]);
				usedColors.push(blocklyColours[1]);
				break;
			case 'System':
				categoryTab.setAttribute("colour", colours[2]);
				usedColors.push(blocklyColours[2]);
				break;
			case 'Backpack':
				categoryTab.setAttribute("colour", colours[3]);
				usedColors.push(blocklyColours[3]);
				break;
			case 'Navigation':
				categoryTab.setAttribute("colour", colours[4]);
				usedColors.push(blocklyColours[4]);
				break;
			case 'Expression':
				categoryTab.setAttribute("colour", colours[5]);
				usedColors.push(blocklyColours[5]);
				break;
			case 'Perception':
				categoryTab.setAttribute("colour", colours[6]);
				usedColors.push(blocklyColours[6]);
				break;
			case 'Skills':
				categoryTab.setAttribute("colour", colours[7]);
				usedColors.push(blocklyColours[7]);
				break;
			default:
				categoryTab.setAttribute("colour", colours[i]);
		}
		//categoryTab.setAttribute("colour", colours[i]);

		let commandGroup = commandGroups[categories[i]];
		for (var j = 0; j < commandGroup.length; j++) {
			addBlock(commandGroup[j], categoryTab, usedColors[i], level);
		}
		toolbox.appendChild(categoryTab);
	}
	workspace.updateToolbox(toolbox); 	// displays the rest of the Blockly blocks on the screen (after Blockly Blocks, Variables, Functions already displayed)
}

