import React from 'react';
import useStore from "../Store";
import * as Blockly from 'blockly';
import { forBlock } from '../generators/javascript';

// Convert to a custom hook or move logic into a React component
const useCompile = (props) => {
  const getBlock = useStore((state) => state.getBlock);
  const ip = useStore((state) => state.ip);

  // Fixed case-sensitive function call
  const ifDo = (IF0, DO0) => {
    const ifInput = getBlock(IF0);
    let doInput = getBlock(DO0);
    // Check if input is logically true
    if (compile(ifInput, ifInput.type)) {
      //if true, iteratively run blocks
      compile(doInput, doInput.type);
      while (doInput.next){
        doInput = getBlock(doInput.next);
  
        compile(doInput, doInput.type);
      }
    }else{
      return
    }
  };

  const logicBoolean = (BOOL) => {
    if(BOOL ==="TRUE"){
      return true
    }
    else{
      return false
    }
  };

  function getRandomInt(min, max) {
    min = Math.ceil(min); // Ensure min is a ceil value so it's included in the range
    max = Math.floor(max); // Ensure max is a floor value so it's included in the range
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function sendPostRequestToRobot(endpoint,payload) {
    fetch(`http://${ip}/api/${endpoint}`, {
      method: 'POST',
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
      }).then(res => res.json()).then(json => {
            
        console.log(`successfully send a post request, the response is: ${json}`)
      })
  }

  function hexToRgb(hex) {
    // Remove the hash if it exists
    hex = hex.replace(/^#/, '');
  
    // Parse the hex values
    var bigint = parseInt(hex, 16);
  
    // Extract RGB components
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
  
    // Return the result as an object
    return { red: r, green: g, blue: b };
  }
  function isPrime(num) {
    if (num == 2 || num == 3)
      return true;
    if (num <= 1 || num % 2 == 0 || num % 3 == 0)
      return false;  
    for (let i = 5; i * i <= num ; i+=6) {
      if (num % i == 0 || num % (i + 2) == 0)
        return false;
    }
    return true;
  }

  function checkShadowinput(input){
    if (typeof input !== 'string'){
        return input.shadow.fields.NUM
    }
    else{
      return compile(getBlock(input))
    }
  }

  const compile = (params, type) => {
    switch (true) {
      case type === 'Test':
        console.log('test block runs')
        return

      case type === 'controls_if':
        if(!params.inputs||!params.inputs.IF0 ||!params.inputs.DO0){
          alert('err: controls_if not complete!')
          return
        }
        else{
          ifDo(params.inputs.IF0, params.inputs.DO0);
        }
        break; 


      case type === 'logic_boolean':
        return logicBoolean(params.fields.BOOL);
        
      case type === "logic_compare":
        if(!params.inputs||!params.inputs.A ||!params.inputs.B){
          alert('err: logic_compare is not complete!')
          return
        }
        //get the two input and see if they are logically equal
        const logic_compare_oprand = params.fields.OP
        const logic_compare_A_id = params.inputs.A
        const logic_compare_B_id = params.inputs.B
        const logic_compare_A_params = getBlock(logic_compare_A_id)
        const logic_compare_B_params = getBlock(logic_compare_B_id)
        if(logic_compare_oprand ==="EQ"){
          return (compile(logic_compare_A_params, logic_compare_A_params.type) == compile(logic_compare_B_params, logic_compare_B_params.type)) 
        }
        else if(logic_compare_oprand ==="NEQ"){
          return (compile(logic_compare_A_params, logic_compare_A_params.type) !== compile(logic_compare_B_params, logic_compare_B_params.type)) 
        }
        else if(logic_compare_oprand ==="LT"){
          return (compile(logic_compare_A_params, logic_compare_A_params.type) < compile(logic_compare_B_params, logic_compare_B_params.type)) 
        }
        else if(logic_compare_oprand ==="LTE"){
          return (compile(logic_compare_A_params, logic_compare_A_params.type) <= compile(logic_compare_B_params, logic_compare_B_params.type)) 
        }
        else if(logic_compare_oprand ==="GT"){
          return (compile(logic_compare_A_params, logic_compare_A_params.type) > compile(logic_compare_B_params, logic_compare_B_params.type)) 
        }
        else if(logic_compare_oprand ==="GTE"){
          return (compile(logic_compare_A_params, logic_compare_A_params.type) >= compile(logic_compare_B_params, logic_compare_B_params.type)) 
        }

      case type === "logic_operation":
        if(!params.inputs||!params.inputs.A ||!params.inputs.B){
          alert('err: logic_operation is not complete!')
          return
        }
        const oprand = params.fields.OP
        const logic_operation_A_id = params.inputs.A
        const logic_operation_B_id = params.inputs.B
        const logic_operation_A_params = getBlock(logic_operation_A_id)
        const logic_operation_B_params = getBlock(logic_operation_B_id)
        if(oprand === 'OR'){
          return (compile(logic_operation_A_params, logic_operation_A_params.type) || compile(logic_operation_B_params, logic_operation_B_params.type))
        }
        else{
          //oprand is and
          return (compile(logic_operation_A_params, logic_operation_A_params.type) && compile(logic_operation_B_params, logic_operation_B_params.type))
        }

      case type === "logic_negate":
        if(!params.inputs){
          alert('err: logic_negate is not complete!')
          return
        }
        const logic_negate_BOOL = getBlock(params.inputs.BOOL)
        return !compile(logic_negate_BOOL, logic_negate_BOOL.type)

      case type ===  "logic_boolean":
        if(!params.fields.BOOL === "FALSE"){
          return false
        }
        else{
          return true
        }
      

      case type ===  "logic_null":
        return null

      case type === "logic_ternary":
        if(!params.inputs||!params.inputs.IF ||!params.inputs.THEN ||!params.inputs.ELSE){
          alert('err: logic_ternary is not complete!')
          return
        }
        const logic_ternary_IF_id = params.inputs.IF 
        const logic_ternary_THEN_id = params.inputs.THEN
        const logic_ternary_ELSE_id = params.inputs.ELSE
        const logic_ternary_IF_params = getBlock(logic_ternary_IF_id)
        const logic_ternary_THEN_params = getBlock(logic_ternary_THEN_id)
        const logic_ternary_ELSE_params = getBlock(logic_ternary_ELSE_id)
        const logic_ternary_condition = compile(logic_ternary_IF_params, logic_ternary_IF_params.type)
        //if the condition is true
        if(logic_ternary_condition){
          return compile(logic_ternary_THEN_params, logic_ternary_THEN_params.type)
        }
        else{
          return compile(logic_ternary_ELSE_params, logic_ternary_ELSE_params.type)
        }

/////////////////////////////////////////////LOGIC///////////////////////////////////////////////////////////////
      
      case type === "controls_repeat_ext":
        const controls_repeat_ext_TIMES = checkShadowinput(params.inputs.TIMES)
        if(!params.inputs.DO){
          alert('err: controls_repeat_ext is not complete!')
          return
        }
        let controls_repeat_ext_DO_params = getBlock(params.inputs.DO)
        for (let i = 0; i < controls_repeat_ext_TIMES; i++) {
          console.log(i)
          compile(controls_repeat_ext_DO_params,controls_repeat_ext_DO_params.type)
          let currBlock = controls_repeat_ext_DO_params
          while (currBlock.next){
            
            currBlock = getBlock(currBlock.next);
            compile(currBlock, currBlock.type);
          }
        }   
        return

/////////////////////////////////////////////LOOP////////////////////////////////////////////////////////////////

      case type === "math_number":
        return params.fields.NUM
      
      case type === "math_number_property":
        const math_number_property_PROPERTY = params.fields.PROPERTY
        const math_number_property_NUMBER_TO_CHECK = checkShadowinput(params.inputs.NUMBER_TO_CHECK)
        if(math_number_property_PROPERTY === "EVEN"){
          //check if the number is even
          return math_number_property_NUMBER_TO_CHECK % 2 === 0
        }else if(math_number_property_PROPERTY === "ODD"){
          //check if the number is odd
          return math_number_property_NUMBER_TO_CHECK % 2 === 1
        }else if(math_number_property_PROPERTY === "PRIME"){
          //check if the number is prime number
          return isPrime(math_number_property_NUMBER_TO_CHECK)
        }else if(math_number_property_PROPERTY === "WHOLE"){
          //check if the number is whole number
          return math_number_property_NUMBER_TO_CHECK % 1 === 0;
        }else if(math_number_property_PROPERTY === "POSITIVE"){
          return math_number_property_NUMBER_TO_CHECK > 0
        }else if(math_number_property_PROPERTY === "NEGATIVE"){
          return math_number_property_NUMBER_TO_CHECK < 0
        }else if(math_number_property_PROPERTY === "DIVISIBLE_BY"){
          if(!params.inputs||!params.inputs.DIVISOR){
            alert('err: DIVISOR is not filled!')
            return
          }else if(params.inputs.DIVISOR === 0){
            alert('Note that divisor cannot be 0!')
            return
          }else{
            return math_number_property_NUMBER_TO_CHECK % params.inputs.DIVISOR === 0 
          } 
        }
        return

      case type === "math_random_int":
        const math_random_int_FROM = checkShadowinput(params.inputs.FROM)
        const math_random_int_TO = checkShadowinput(params.inputs.TO)
        return  getRandomInt(math_random_int_FROM, math_random_int_TO);


/////////////////////////////////////////////MATH////////////////////////////////////////////////////////////////

      case type === "colour_picker":
        return hexToRgb(params.fields.COLOUR)

      case type === "colour_random":
        let r = getRandomInt(0,255)
        let g = getRandomInt(0,255)
        let b = getRandomInt(0,255)
        return { red: r, green: g, blue: b };
      
      case type === "colour_rgb":
        const colour_rgb_RED = checkShadowinput(params.inputs.RED)
        const colour_rgb_GREEN = checkShadowinput(params.inputs.GREEN)
        const colour_rgb_BLUE = checkShadowinput(params.inputs.BLUE)
        return { red: colour_rgb_RED, green: colour_rgb_GREEN, blue: colour_rgb_BLUE };
          
      case type === "colour_blend":
        const colour_blend_RATIO = checkShadowinput(params.inputs.RATIO)
        const colour_blend_COLOUR1 = hexToRgb(params.inputs.COLOUR1.shadow.fields.COLOUR)
        const colour_blend_COLOUR2 = hexToRgb(params.inputs.COLOUR2.shadow.fields.COLOUR)
        const colour_blend_COLOR1_r = colour_blend_COLOUR1.r * colour_blend_RATIO
        const colour_blend_COLOR1_g = colour_blend_COLOUR1.g * colour_blend_RATIO
        const colour_blend_COLOR1_b = colour_blend_COLOUR1.b * colour_blend_RATIO

        const colour_blend_COLOR2_r = colour_blend_COLOUR2.r
        const colour_blend_COLOR2_g = colour_blend_COLOUR2.g
        const colour_blend_COLOR2_b = colour_blend_COLOUR2.b

        const new_r = (colour_blend_COLOR2_r + colour_blend_COLOR1_r)/(colour_blend_RATIO + 1)
        const new_g = (colour_blend_COLOR2_g + colour_blend_COLOR1_g)/(colour_blend_RATIO + 1)
        const new_b = (colour_blend_COLOR2_b + colour_blend_COLOR1_b)/(colour_blend_RATIO + 1)


        return { red: new_r, green: new_g, blue: new_b };


/////////////////////////////////////////////Color///////////////////////////////////////////////////////////////
      case type === "ChangeLED":

        // Declare list of arguments the block will use, if any
        const args = ["Red", "Green", "Blue"]
        //const payload = {};
        var endpoint = "led"
        var input = params.fields.FIELD_ChangeLED;
        var payload = hexToRgb(input);
        // For each argument, get the current value in the corresponding field and append it to the payload
        // for (var arg of args) {
        //   var input = block.getFieldValue("FIELD_ChangeLED");
        //   payload[arg] = hexToRgb(input)[arg];
        // } 
        // Tell the robot what to do based on the payload
        //console.log(input,payload)
        console.log(payload)
        sendPostRequestToRobot(endpoint, payload);
        return ;
      
      case type === "DisplayImage":
        var alpha = 1
        var filename = params.fields.FIELD_DisplayImage_Filename;
        var endpoint = "images/display";
        var payload = {
          "FileName": filename,
          "Alpha": alpha
        };
        sendPostRequestToRobot(endpoint, payload);
        return ;
        
      case type === "PlayAudio":
        var endpoint = "audio/play"
        var filename = params.fields.FIELD_PlayAudio_Filename;
        var payload = {
          "FileName": filename,
        };
        sendPostRequestToRobot(endpoint, payload);
        return;
        

      case type === "DisplayText":
        var endpoint = "text/display"
        var text = params.fields.FIELD_DisplayText_Text;
        var payload = {
          "Text": text
        };
        sendPostRequestToRobot(endpoint, payload);
        return;
        
      
      case type === "TurnOnFlashlight":
        var endpoint = "flashlight"
        var payload = {
          "On": true
        }
        sendPostRequestToRobot(endpoint, payload);
        return;
      
      
      case type === "TurnOffFlashlight":
        var endpoint = "flashlight"
        var payload = {
          "On": false
        }
        sendPostRequestToRobot(endpoint, payload);
        return;

      case type === "MoveArm":
        var arm = params.fields.FIELD_MoveArm_Arm === "Right" ? "Right" : "Left";
        var position = parseInt(params.fields.FIELD_MoveArm_Position);
        var velocity = parseInt(params.fields.FIELD_MoveArm_Velocity);
        var endpoint = "arms"
        var payload = {
          Arm: arm,
          Position: position,
          Velocity: velocity,
          Units: "Position"
        }
        sendPostRequestToRobot(endpoint, payload);
        return;
      
      case type === "MoveArm2":  
        var position = parseInt(params.fields.FIELD_MoveArm2_Position);
        var velocity = parseInt(params.fields.FIELD_MoveArm2_Velocity);
        var endpoint = "arms"
        var payload = {
          Arm: both, 
          Position: position,
          Velocity: velocity,
          Units: "Position"
        };
        sendPostRequestToRobot(endpoint, payload);
        return;
        
      case type === "MoveArms2":  
        var left_position = checkShadowinput(params.inputs.FIELD_MoveArm_LeftPosition)
        var left_velocity = checkShadowinput(params.inputs.FIELD_MoveArm_LeftVelocity)
        var right_position = checkShadowinput(params.inputs.FIELD_MoveArm_RightPosition)
        var right_velocity = checkShadowinput( params.inputs.FIELD_MoveArm_RightVelocity)
        var payload = {
          LeftArmPosition: left_position,
          RightArmPosition: right_position,
          LeftArmVelocity: left_velocity,
          RightArmVelocity: right_velocity,
          Units: "Position"
        };
        var endpoint = "arms/set"
        //console.log(payload)
        sendPostRequestToRobot(endpoint,payload);
        return;



      
      case type === "MoveHead":
        var pitch = params.fields.FIELD_MoveHead_Pitch === "D" ? 5 : -5;
        var velocity = parseInt(params.fields.FIELD_MoveHead_Velocity);
        var endpoint = "head";
        var payload = {
          Pitch: pitch,		//-5 - 5
          Yaw: 0,
          Roll: 0,
          Units: "position" 
        };
        sendPostRequestToRobot(endpoint, payload);

        return ;
  
      case type === "MoveHead3": 
        var pitch, roll, yaw;
        var endpoint = "head";
        pitch = checkShadowinput(params.inputs.FIELD_MoveHead_Pitch)
        roll = checkShadowinput(params.inputs.FIELD_MoveHead_Roll)
        yaw = checkShadowinput(params.inputs.FIELD_MoveHead_Yaw)
        var payload = {
          Pitch:pitch,
          Yaw:yaw,
          Roll:roll,
          Units: "degrees"
        };
        sendPostRequestToRobot(endpoint,payload);
        return ;

      case type === "DriveTime": 
        var direction = params.fields.FIELD_DriveTime_Direction;
        var velocity = parseInt(params.fields.FIELD_DriveTime_Velocity);
        var time = parseInt(params.fields.FIELD_DriveTime_TimeMs);		
        var endpoint = "drive/time"		
        var linearVelocity = direction === "F" ? velocity : -velocity;
        var payload = {
          LinearVelocity: linearVelocity,
          AngularVelocity: 0,
          TimeMs: time
        };
        sendPostRequestToRobot(endpoint,payload);
        return;
        
      case type === "DriveTime2": 
      
        var endpoint = "drive/time"	
        var linearVelocity = checkShadowinput(params.inputs.FIELD_DriveTime_Velocity)
        var angularVelocity = checkShadowinput(params.inputs.FIELD_DriveTime_Angular)
        var time = checkShadowinput(params.inputs.FIELD_DriveTime_TimeMs)
        var payload = {
          LinearVelocity: linearVelocity,
          AngularVelocity: angularVelocity,
          TimeMs: time
        };
        sendPostRequestToRobot(endpoint,payload);
        return;
      
      case type == "Turn":
        var direction = params.fields.FIELD_Turn_Direction;
        var time = parseInt(params.fields.FIELD_Turn_Duration);		
        var angularVelocity = 100;
        var linearVelocity = 0;
        var degree = direction === "L" ? 90 : -90;
        var endpoint = "drive/time"
        var payload = {
          LinearVelocity: linearVelocity,
          AngularVelocity: angularVelocity,
          TimeMs: time,
          Degree: degree
        };
        sendPostRequestToRobot(endpoint,payload);
        return;
      
      case type == "Turn2":
        var direction = params.fields.FIELD_Turn_Direction;
        var time = parseInt(checkShadowinput(params.inputs.FIELD_Turn_Duration))
        var angularVelocity = 100;
        var linearVelocity = 0;
        var degree = direction === "L" ? 90 : -90;
        var payload = {
          LinearVelocity: linearVelocity,
          AngularVelocity: angularVelocity,
          TimeMs: time,
          Degree: degree
        };
        var endpoint = "drive/time"
        sendPostRequestToRobot(endpoint,payload);
        return;

      case type == "Speak":
        var endpoint = "tts/speak"
        var text = params.fields.FIELD_Speak_Text;
        var payload = {
          "Text": `<speak>${text}</speak>`
        };
        sendPostRequestToRobot(endpoint,payload);
        return;

      default:
        return "No case match";
    }
  };

  return { compile };
};

// Exporting as a custom hook or incorporate within a React component
export default useCompile;
