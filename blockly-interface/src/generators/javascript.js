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

forBlock["Turn"] = function (block) {
	var direction = block.getFieldValue("FIELD_Turn_Direction");
	var time = parseInt(block.getFieldValue("FIELD_Turn_Duration"));		
	var angularVelocity = 100;
	var linearVelocity = 0;
	var degree = direction === "L" ? 90 : -90;
	let payload = '{"LinearVelocity":'+linearVelocity+',"AngularVelocity":'+angularVelocity+',"TimeMs":'+time+',"Degree":'+degree+'}';
	//var code = 'sendPostRequestToRobot("' + endpoint + '","' + ip + '",' + payload + ');'+delayJS(time+'+500');
	return `${time}`;
};

forBlock["Start"] = function (block) {
  return ''
}


