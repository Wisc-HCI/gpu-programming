import React from 'react';
import useStore from "../Store";

// Convert to a custom hook or move logic into a React component
const useCompile = (props) => {
  const getBlock = useStore((state) => state.getBlock);

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
          console.log('err: logic_compare not complete!')
          return
        }
        //get the two input and see if they are logically equal
        const A_id = params.inputs.A
        const B_id = params.inputs.B
        const A_params = getBlock(A_id)
        const B_params = getBlock(B_id)
        return (compile(A_params, A_params.type) == compile(B_params, B_params.type)) 
        
      case type === "logic_operation":
        if(!params.inputs||!params.inputs.A ||!params.inputs.B){
          console.log('err: logic_operation not complete!')
          return
        }
        
      case type === "ChangeLED":
        console.log('ChangeLED')
        return ;
        
      default:
        return "Mixed case";
    }
  };

  return { compile };
};

// Exporting as a custom hook or incorporate within a React component
export default useCompile;
