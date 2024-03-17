import React from 'react';
import useStore from "../Store";

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


      case type === "ChangeLED":
        console.log('ChangeLED')
        return ;
      
      case type === "DisplayImage":
  //       var alpha = 1
  //       var filename = block.getFieldValue("FIELD_DisplayImage_Filename");
  //       var endpoint = "images/display";
  //       var payload = {
  //   "FileName": filename,
  //   "Alpha": alpha
    
  // };
  // var code = 'sendPostRequestToRobot("' + endpoint + '",' + JSON.stringify(payload) + ");";
  // return code;
  //       sendPostRequestToRobot();
        return ;
      default:
        return "Mixed case";
    }
  };

  return { compile };
};

// Exporting as a custom hook or incorporate within a React component
export default useCompile;
