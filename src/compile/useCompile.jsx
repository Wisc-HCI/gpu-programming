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
    }
  };

  const logicBoolean = (BOOL) => {
    return BOOL; 
  };

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

  function checkShadowinput(input){
    if (typeof input !== 'string'){
        return input.shadow.fields.NUM
    }
    else{
      return compile(getBlock(input))
    }
  }
  const compile = (params, type) => {
    console.log('compile')
    switch (true) {
      case type === 'controls_if':
        if(!params.inputs||!params.inputs.IF0 ||!params.inputs.DO0){
          console.log('err: controls_if not complete!')
          return
        }
        else{ifDo(params.inputs.IF0, params.inputs.DO0);}
        break; // Add break to prevent fall-through
      case type === 'logic_boolean':
        return logicBoolean(params.fields.BOOL);
        
      case type === "logic_compare":
        if(!params.inputs||!params.inputs.A ||!params.inputs.B){
          console.log('err: logic_compare is not complete!')
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
          console.log('err: logic_operation is not complete!')
          return
        }
        const oprand = params.fields.OP
        const logic_operation_A_id = params.inputs.A
        const logic_operation_B_id = params.inputs.B
        const logic_operation_A_params = getBlock(logic_operation_A_id)
        const logic_operation_B_params = getBlock(logic_operation_B_id)
        if(oprand === 'OR'){
          return (compile(logic_operation_A_params, logic_operation_A_params.type) || compile(logic_operation_B_params, logic_operation_B_params.type))
          break;
        }
        else{
          //oprand is and
          return (compile(logic_operation_A_params, logic_operation_A_params.type) && compile(logic_operation_B_params, logic_operation_B_params.type))
        }
        break

      case type === "logic_negate":
        if(!params.inputs){
          console.log('err: logic_negate is not complete!')
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
          console.log('err: logic_ternary is not complete!')
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
        sendPostRequestToRobot(endpoint,JSON.stringify(payload));
        return ;
      
      case type === "DisplayImage":
        var alpha = 1
        var filename = params.fields.FIELD_DisplayImage_Filename;
        var endpoint = "images/display";
        var payload = {
          "FileName": filename,
          "Alpha": alpha
        };
        sendPostRequestToRobot(endpoint,JSON.stringify(payload));
        return ;

      case type === "MoveArm":
        var arm = params.fields.FIELD_MoveArm_Arm === "Right" ? "Right" : "Left";
        var position = parseInt(params.fields.FIELD_MoveArm_Position);
        var velocity = parseInt(params.fields.FIELD_MoveArm_Velocity);
        var endpoint = "arms"
        var payload = '{"Arm":'+"\""+arm+"\""+',"Position":'+position+',"Velocity":'+velocity+',"Units":"Position"}'
        sendPostRequestToRobot(endpoint,JSON.stringify(payload));
        return;
      
      case type === "MoveArm2":  
        var position = parseInt(params.fields.FIELD_MoveArm2_Position);
        var velocity = parseInt(params.fields.FIELD_MoveArm2_Velocity);
        var endpoint = "arms"
        var payload = '{"Arm": "both", "Position":'+position+',"Velocity":'+velocity+',"Units":"Position"}'
        sendPostRequestToRobot(endpoint,JSON.stringify(payload));
        return;
        
      case type === "MoveArms2":  
        var left_position = checkShadowinput(params.inputs.FIELD_MoveArm_LeftPosition)
        var left_velocity = checkShadowinput(params.inputs.FIELD_MoveArm_LeftVelocity)
        var right_position = checkShadowinput(params.inputs.FIELD_MoveArm_RightPosition)
        var right_velocity = checkShadowinput( params.inputs.FIELD_MoveArm_RightVelocity)
        var payload = '{"LeftArmPosition":'+left_position+',"RightArmPosition":'+right_position+',"LeftArmVelocity":'+left_velocity+',"RightArmVelocity":'+right_velocity+',"Units": "Position"}'
        var endpoint = "arms/set"
        //console.log(payload)
        sendPostRequestToRobot(endpoint,JSON.stringify(payload));
        return;



      
      case type === "MoveHead":
        var pitch = params.fields.FIELD_MoveHead_Pitch === "D" ? 5 : -5;
        var velocity = parseInt(params.fields.FIELD_MoveHead_Velocity);
        var endpoint = "head";
        var payload = {
          "Pitch": pitch,		//-5 - 5
          "Yaw": 0,											
          "Roll": 0,
          "Units": "position" 
        };
        sendPostRequestToRobot(endpoint,JSON.stringify(payload));

        return ;
  
      case type === "MoveHead3": 
        var pitch, roll, yaw;
        var endpoint = "head";
        pitch = checkShadowinput(params.inputs.FIELD_MoveHead_Pitch)
        roll = checkShadowinput(params.inputs.FIELD_MoveHead_Roll)
        yaw = checkShadowinput(params.inputs.FIELD_MoveHead_Yaw)
        var payload = '{"Pitch":'+pitch+',"Yaw":'+yaw+',"Roll":'+roll+',"Units": "degrees"}';
        sendPostRequestToRobot(endpoint,JSON.stringify(payload));
        return ;

      case type === "DriveTime": 
        var direction = params.fields.FFIELD_DriveTime_Direction;
        var velocity = parseInt(params.fields.FFIELD_DriveTime_Velocity);
        var time = parseInt(params.fields.FFIELD_DriveTime_TimeMs);		
        var endpoint = "drive/time"		
        var linearVelocity = direction === "F" ? velocity : -velocity;
        var payload = '{"LinearVelocity":'+linearVelocity+',"AngularVelocity":0,"TimeMs":'+time+'}';
        sendPostRequestToRobot(endpoint,JSON.stringify(payload));
        return;
        
      case type === "DriveTime2": 
      
        var endpoint = "drive/time"	
        var linearVelocity = checkShadowinput(params.inputs.FIELD_DriveTime_Velocity)
        var angularVelocity = checkShadowinput(params.inputs.FIELD_DriveTime_Angular)
        var time = checkShadowinput(params.inputs.FIELD_DriveTime_TimeMs)
        var payload = '{"LinearVelocity":'+linearVelocity+',"AngularVelocity":'+angularVelocity+',"TimeMs":'+time+'}';
        sendPostRequestToRobot(endpoint,JSON.stringify(payload));
        return;
      
      case type == "Turn":
        var direction = params.fields.FIELD_Turn_Direction;
        var time = parseInt(params.fields.FIELD_Turn_Duration);		
        var angularVelocity = 100;
        var linearVelocity = 0;
        var degree = direction === "L" ? 90 : -90;
        var endpoint = "drive/time"
        var payload = '{"LinearVelocity":'+linearVelocity+',"AngularVelocity":'+angularVelocity+',"TimeMs":'+time+',"Degree":'+degree+'}';
        sendPostRequestToRobot(endpoint,JSON.stringify(payload));
        return;
      
      case type = "Turn2":
        var direction = params.fields.FIELD_Turn_Direction;
        var time = checkShadowinput(params.inputs.FIELD_Turn_Duration)
        var angularVelocity = 100;
        var linearVelocity = 0;
        var degree = direction === "L" ? 90 : -90;
        var payload = '{"LinearVelocity":'+linearVelocity+',"AngularVelocity":'+angularVelocity+',"TimeMs":'+time+',"Degree":'+degree+'}';
        var endpoint = "drive/time"
        sendPostRequestToRobot(endpoint,JSON.stringify(payload));
        return;
      
      default:
        return "No case match";
    }
  };

  return { compile };
};

// Exporting as a custom hook or incorporate within a React component
export default useCompile;
