import React from 'react';
import useStore from "../Store";
import { useShallow } from 'zustand/react/shallow'
import * as Blockly from 'blockly';
import { forBlock } from '../generators/javascript';
import { hexToRgb } from '../utils.js';
import { JointLookup } from '../Misty-Robot/JointLookup.js';

/**
  * delayJS(time)
  * Delay timeMS milliseconds
  * @param {int} number of milliseconds to delay
  * @private
*/
export function delayJS(timeMS) {
  var start = new Date().getTime();
  var end = start;
  while(end < start + timeMS){
    end = new Date().getTime();
  }
}
// Convert to a custom hook or move logic into a React component
const useCompile = (props) => {
  const getBlock = useStore(useShallow((state) => state.getBlock));
  const animateArm = useStore(useShallow((state) => state.animateArm));
  const animateBothArms = useStore(useShallow((state) => state.animateBothArms));
  const animateHead = useStore(useShallow((state) => state.animateHead));
  const animateDrive = useStore(useShallow((state) => state.animateDrive));
  const ip = useStore(useShallow((state) => state.ip));

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
    if (ip) {
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
        if (!params.inputs||!params.inputs.FIELD_ChangeLED) {
          alert('err: ChangeLED is not complete!');
          return;
        }
        var endpoint = "led";
        var colorBlock = getBlock(params.inputs.FIELD_ChangeLED);
        var COLOR = hexToRgb(colorBlock.fields.COLOUR);
        var payload = {
          "Red": COLOR.r,
          "Green": COLOR.g,
          "Blue": COLOR.b
        }        
        sendPostRequestToRobot(endpoint, payload);
        delayJS(500);
        return;

      case type === "TransitionLED":
        if (!params.inputs||!params.inputs.COLOR1||!params.inputs.COLOR2) {
          alert('err: TransitionLED is not complete!');
          return;
        }
        var endpoint = "led/transition";
        var colorBlock1 = getBlock(params.inputs.COLOR1);
        var colorBlock2 = getBlock(params.inputs.COLOR2);
        var COLOR1 = hexToRgb(colorBlock1.fields.COLOUR);
        var COLOR2 = hexToRgb(colorBlock2.fields.COLOUR);
        var time = params.fields.FIELD_TransitionTime_TimeMs;
        var transition = params.fields.TRANSITION_TYPE;
        var payload = {
          "Red": COLOR1.r,
          "Green": COLOR1.g,
          "Blue": COLOR1.b,
          "Red2": COLOR2.r,
          "Green2": COLOR2.g,
          "Blue2": COLOR2.b,
          "TransitionType": transition,
          "TimeMS": time
        }
        sendPostRequestToRobot(endpoint, payload);
        delayJS(time+500);
        return;

      case type === "DisplayImage":
        if (!params.inputs||!params.inputs.FIELD_DisplayImage_Filename) {
          alert('err: DisplayImage is not complete!');
          return;
        }
        var alpha = 1
        var exprBlock = getBlock(params.inputs.FIELD_DisplayImage_Filename);
        var filename = JointLookup(exprBlock.type);
        var endpoint = "images/display";
        var payload = {
          "FileName": filename,
          "Alpha": alpha
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(500);
        return;
        
      case type === "PlayAudio":
        if(!params.inputs||!params.inputs.FIELD_PlayAudio_Filename){
          alert('err: PlayAudio is not complete!');
          return;
        }
        var endpoint = "audio/play";
        var exprBlock = getBlock(params.inputs.FIELD_PlayAudio_Filename);
        var filename = JointLookup(exprBlock.type);
        var payload = {
          "FileName": filename,
        };
        sendPostRequestToRobot(endpoint, payload);
        return;

      case type === "DisplayAnimation":
        if(!params.inputs||!params.inputs.FIELD_DisplayAnimation_Filename){
          alert('err: DisplayAnimation is not complete!');
          return;
        }
        var endpoint = "animations/display";
        var exprBlock = getBlock(params.inputs.FIELD_DisplayAnimation_Filename);
        var filename = JointLookup(exprBlock.type);
        var payload = {
          "FileName": filename,
        };
        sendPostRequestToRobot(endpoint, payload);
        return;

      case type === "DisplayText":
        var endpoint = "text/display"
        var text = params.fields.FIELD_DisplayText_Text;
        console.log(text);
        var payload = {
          "Text": text
        };
        console.log(payload);
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

      case type === "WaitForSeconds":
        var time = parseFloat(params.fields.NumSeconds);
        delayJS(time*1000)
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
          Units: "Degrees"
        }
        animateArm(arm, position, velocity);
        sendPostRequestToRobot(endpoint, payload);
        delayJS(1000)
        return;
      
      case type === "MoveArm2":  
        var position = parseInt(params.fields.FIELD_MoveArm2_Position);
        var velocity = parseInt(params.fields.FIELD_MoveArm2_Velocity);
        var endpoint = "arms"
        var payload = {
          Arm: "both", 
          Position: position,
          Velocity: velocity,
          Units: "Degrees"
        };

        animateBothArms(position, velocity, position, velocity);
        sendPostRequestToRobot(endpoint, payload);
        delayJS(1000)
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
          Units: "Degrees"
        };
        var endpoint = "arms/set"
        //console.log(payload)
        animateBothArms(left_position, left_velocity, right_position, right_velocity);
        sendPostRequestToRobot(endpoint,payload);
        delayJS(1000)
        return;



      
      case type === "MoveHead":
        var pitch = params.fields.FIELD_MoveHead_Pitch === "D" ? 25 : -40;
        var velocity = parseInt(params.fields.FIELD_MoveHead_Velocity);
        var endpoint = "head";
        var payload = {
          Pitch: pitch,		//-5 - 5
          Yaw: 0,
          Roll: 0,
          Duration: 2,
          Units: "degrees"
        };

        animateHead(0, pitch, 0, 2);
        sendPostRequestToRobot(endpoint, payload);
        delayJS(500)

        return ;
  
      case type === "MoveHead3": 
        var pitch, roll, yaw;
        var endpoint = "head";
        pitch = checkShadowinput(params.inputs.FIELD_MoveHead_Pitch)
        roll = checkShadowinput(params.inputs.FIELD_MoveHead_Roll)
        yaw = checkShadowinput(params.inputs.FIELD_MoveHead_Yaw)
        time = checkShadowinput(params.inputs.FIELD_MoveHead_Time)
        var payload = {
          Pitch:pitch,
          Yaw:yaw,
          Roll:roll,
          Duration:time,
          Units: "degrees"
        };
        animateHead(roll, pitch, yaw, time);
        sendPostRequestToRobot(endpoint,payload);
        delayJS(500)
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
        animateDrive(linearVelocity, 0, 0, time);
        sendPostRequestToRobot(endpoint,payload);
        delayJS(time + 500)
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
        animateDrive(linearVelocity, angularVelocity, 0, time);
        sendPostRequestToRobot(endpoint,payload);
        delayJS(time + 500)
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
        animateDrive(linearVelocity, angularVelocity, degree, time);
        sendPostRequestToRobot(endpoint,payload);
        delayJS(time + 500)
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
        animateDrive(linearVelocity, angularVelocity, degree, time);
        sendPostRequestToRobot(endpoint,payload);
        delayJS(time + 500)
        return;

      case type == "Speak":
        var endpoint = "tts/speak"
        var text = params.inputs.FIELD_Speak_Text;
        var payload = {
          "Text": `<speak>${text}</speak>`
        };
        sendPostRequestToRobot(endpoint,payload);
        delayJS(500)
        return;

      case type == "SpeakDefault":
        var endpoint = "tts/speak"
        var text = params.fields.FIELD_SpeakDefault_Text;
        var payload = {
          "Text": `<speak>${text}</speak>`
        };
        sendPostRequestToRobot(endpoint,payload);
        delayJS(500)
        return;

      default:
        return "No case match";
    }
  };

  return { compile };
};

// Exporting as a custom hook or incorporate within a React component
export default useCompile;
