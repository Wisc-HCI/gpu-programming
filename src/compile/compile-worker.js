import { ARM_OFFSET_ANGLE, MAX_ARM_SPEED, MISTY_ARM_LENGTH, MS_TO_SEC, PI } from "../Constants.js";
import { JointLookup } from "../Misty-Robot/JointLookup.js";
import { AudioLookup } from "../Misty-Robot/audio/audiolookup.js";
import { FaceFilenameLookup } from "../Misty-Robot/faces/facefilename.js";
import { FaceLookup } from "../Misty-Robot/faces/facemap.js";
import { eulerToQuaternion, hexToRgb, quaternionToEuler } from "../utils.js";

const delayJS = (timeMS) => {
  // Temporarily Commenting this out
  var start = new Date().getTime();
  var end = start;
  while (end < start + timeMS) {
    end = new Date().getTime();
  }
};

function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    return reader.result;
  };
  reader.onerror = function (error) {
    return "Error: ", error;
  };
}

self.onmessage = function (e) {
  const {blocks, mistyAudioList, mistyImageList, tfs, ip, runOnRobot} = e.data;

  const getBlocksByType = (type) => {
    return Object.values(blocks).filter((block) => block.type === type)[0];
  };
  const getBlock = (id) => blocks[id];

  // Fixed case-sensitive function call
  const ifDo = (IF0, DO0) => {
    const ifInput = getBlock(IF0);
    // Check if input is logically true
    if (compile(ifInput, ifInput.type)) {
      if (DO0) {
        let doInput = getBlock(DO0);
        //if true, iteratively run blocks
        compile(doInput, doInput.type);
        while (doInput.next) {
          doInput = getBlock(doInput.next);
  
          compile(doInput, doInput.type);
        }
      }
    } else {
      return;
    }
  };

  const logicBoolean = (BOOL) => {
    if (BOOL === "TRUE") {
      return true;
    } else {
      return false;
    }
  };

  function getRandomInt(min, max) {
    min = Math.ceil(min); // Ensure min is a ceil value so it's included in the range
    max = Math.floor(max); // Ensure max is a floor value so it's included in the range
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function sendPostRequestToRobot(endpoint, payload) {
    if (ip && runOnRobot) {
      fetch(`http://${ip}/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }
  }

  function isPrime(num) {
    if (num === 2 || num === 3) return true;
    if (num <= 1 || num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  }

  function checkShadowinput(input) {
    if (typeof input !== "string" && typeof input !== "object") {
      return input.shadow.fields.NUM;
    } else {
      let block = input?.shadow?.id ? getBlock(input.shadow.id) : getBlock(input);
      return compile(block, block.type);
    }
  }

  const compile = (params, type) => {
    console.log(params);
    switch (true) {
      case type === "controls_if":
        if (!params.inputs || !params.inputs.IF0) {
          throw new Error(`err: controls_if do not have input value! id: ${params.id}`);
          //appendActivity("Try running with incomplete controls_if");
        } else {
          ifDo(params.inputs.IF0, params.inputs.DO0);
        }
        break;

      case type === "logic_boolean":
        return logicBoolean(params.fields.BOOL);

      case type === "logic_compare":
        if (!params.inputs || !params.inputs.A || !params.inputs.B) {
          throw new Error( `err: logic_compare do not have input value! id: ${params.id}` );
          //appendActivity("Try running with incomplete logic_compare");
        }
        //get the two input and see if they are logically equal
        const logic_compare_oprand = params.fields.OP;
        const logic_compare_A_id = params.inputs.A;
        const logic_compare_B_id = params.inputs.B;
        const logic_compare_A_params = getBlock(logic_compare_A_id);
        const logic_compare_B_params = getBlock(logic_compare_B_id);
        if (logic_compare_oprand === "EQ") {
          return (
            compile(logic_compare_A_params, logic_compare_A_params.type) ==
            compile(logic_compare_B_params, logic_compare_B_params.type)
          );
        } else if (logic_compare_oprand === "NEQ") {
          return (
            compile(logic_compare_A_params, logic_compare_A_params.type) !==
            compile(logic_compare_B_params, logic_compare_B_params.type)
          );
        } else if (logic_compare_oprand === "LT") {
          return (
            compile(logic_compare_A_params, logic_compare_A_params.type) <
            compile(logic_compare_B_params, logic_compare_B_params.type)
          );
        } else if (logic_compare_oprand === "LTE") {
          return (
            compile(logic_compare_A_params, logic_compare_A_params.type) <=
            compile(logic_compare_B_params, logic_compare_B_params.type)
          );
        } else if (logic_compare_oprand === "GT") {
          return (
            compile(logic_compare_A_params, logic_compare_A_params.type) >
            compile(logic_compare_B_params, logic_compare_B_params.type)
          );
        } else if (logic_compare_oprand === "GTE") {
          return (
            compile(logic_compare_A_params, logic_compare_A_params.type) >=
            compile(logic_compare_B_params, logic_compare_B_params.type)
          );
        }

      /* eslint-disable-next-line no-fallthrough */
      case type === "logic_operation":
        if (!params.inputs || !params.inputs.A || !params.inputs.B) {
          throw new Error( `err: logic_operation do not have input value! id: ${params.id}` );      
          //appendActivity("Try running with incomplete logic_operation");
        }

        const oprand = params.fields.OP;
        const logic_operation_A_id = params.inputs.A;
        const logic_operation_B_id = params.inputs.B;
        const logic_operation_A_params = getBlock(logic_operation_A_id);
        const logic_operation_B_params = getBlock(logic_operation_B_id);
        if (oprand === "OR") {
          return (
            compile(logic_operation_A_params, logic_operation_A_params.type) ||
            compile(logic_operation_B_params, logic_operation_B_params.type)
          );
        } else {
          //oprand is and
          return (
            compile(logic_operation_A_params, logic_operation_A_params.type) &&
            compile(logic_operation_B_params, logic_operation_B_params.type)
          );
        }

      case type === "logic_negate":
        if (!params.inputs) {
          throw new Error(`err: logic_negate do not have input value! id: ${params.id}`);
          //appendActivity("Try running with incomplete logic_negate");
        }
        const logic_negate_BOOL = getBlock(params.inputs.BOOL);
        return !compile(logic_negate_BOOL, logic_negate_BOOL.type);

      case type === "logic_boolean":
        if (!params.fields.BOOL === "FALSE") {
          return false;
        } else {
          return true;
        }

      case type === "logic_null":
        return null;

      case type === "logic_ternary":
        if (
          !params.inputs ||
          !params.inputs.IF ||
          !params.inputs.THEN ||
          !params.inputs.ELSE
        ) {
          throw new Error( `err: logic_ternary do not have input value! id: ${params.id}` );
          //appendActivity("Try running with incomplete logic_ternary");
        }
        const logic_ternary_IF_id = params.inputs.IF;
        const logic_ternary_THEN_id = params.inputs.THEN;
        const logic_ternary_ELSE_id = params.inputs.ELSE;
        const logic_ternary_IF_params = getBlock(logic_ternary_IF_id);
        const logic_ternary_THEN_params = getBlock(logic_ternary_THEN_id);
        const logic_ternary_ELSE_params = getBlock(logic_ternary_ELSE_id);
        const logic_ternary_condition = compile(
          logic_ternary_IF_params,
          logic_ternary_IF_params.type
        );
        //if the condition is true
        if (logic_ternary_condition) {
          return compile(
            logic_ternary_THEN_params,
            logic_ternary_THEN_params.type
          );
        } else {
          return compile(
            logic_ternary_ELSE_params,
            logic_ternary_ELSE_params.type
          );
        }

      /////////////////////////////////////////////LOGIC///////////////////////////////////////////////////////////////

      case type === "controls_repeat_ext":
        const controls_repeat_ext_TIMES = checkShadowinput(params.inputs.TIMES);
        if (!params.inputs.DO) {
          throw new Error(`err: controls_repeat_ext do not have input value! id: ${params.id}`);
          //appendActivity("Try running with incomplete controls_repeat_ext");
        }
        let controls_repeat_ext_DO_params = getBlock(params.inputs.DO);
        for (let i = 0; i < controls_repeat_ext_TIMES; i++) {
          compile(
            controls_repeat_ext_DO_params,
            controls_repeat_ext_DO_params.type
          );
          let currBlock = controls_repeat_ext_DO_params;
          while (currBlock.next) {
            currBlock = getBlock(currBlock.next);
            compile(currBlock, currBlock.type);
          }
        }
        return;

      /////////////////////////////////////////////LOOP////////////////////////////////////////////////////////////////

      case type === "math_number":
        return params.fields.NUM;

      case type == "BasicSlider":
      case type == "ArmPositionSlider":
      case type == "SpeedSlider":
      case type == "TimeSlider":
      case type == "HeadPitchSlider":
      case type == "HeadRollSlider":
      case type == "HeadYawSlider":
        return params.fields["FIELD_slider_value"];

      case type === "math_number_property":
        const math_number_property_PROPERTY = params.fields.PROPERTY;
        const math_number_property_NUMBER_TO_CHECK = checkShadowinput(
          params.inputs.NUMBER_TO_CHECK
        );
        if (math_number_property_PROPERTY === "EVEN") {
          //check if the number is even
          return math_number_property_NUMBER_TO_CHECK % 2 === 0;
        } else if (math_number_property_PROPERTY === "ODD") {
          //check if the number is odd
          return math_number_property_NUMBER_TO_CHECK % 2 === 1;
        } else if (math_number_property_PROPERTY === "PRIME") {
          //check if the number is prime number
          return isPrime(math_number_property_NUMBER_TO_CHECK);
        } else if (math_number_property_PROPERTY === "WHOLE") {
          //check if the number is whole number
          return math_number_property_NUMBER_TO_CHECK % 1 === 0;
        } else if (math_number_property_PROPERTY === "POSITIVE") {
          return math_number_property_NUMBER_TO_CHECK > 0;
        } else if (math_number_property_PROPERTY === "NEGATIVE") {
          return math_number_property_NUMBER_TO_CHECK < 0;
        } else if (math_number_property_PROPERTY === "DIVISIBLE_BY") {
          if (!params.inputs || !params.inputs.DIVISOR) {
            throw new Error("err: DIVISOR is not filled!");

            // appendActivity(
            //   "Try running with incomplete math_number_property, DIVISOR is not filled"
            // );
            return;
          } else if (params.inputs.DIVISOR === 0) {
            throw new Error("Note that divisor cannot be 0!");
            // appendActivity(
            //   "Try running with incomplete math_number_property, divisor cannot be 0"
            // );
            return;
          } else {
            return (
              math_number_property_NUMBER_TO_CHECK % params.inputs.DIVISOR === 0
            );
          }
        }
        return;

      case type === "math_random_int":
        const math_random_int_FROM = checkShadowinput(params.inputs.FROM);
        const math_random_int_TO = checkShadowinput(params.inputs.TO);
        return getRandomInt(math_random_int_FROM, math_random_int_TO);

      /////////////////////////////////////////////MATH////////////////////////////////////////////////////////////////

      case type === "colour_picker":
        return hexToRgb(params.fields.COLOUR);

      case type === "colour_random":
        let r = getRandomInt(0, 255);
        let g = getRandomInt(0, 255);
        let b = getRandomInt(0, 255);
        return { r: r, g: g, b: b };

      case type === "colour_rgb":
        const colour_rgb_RED = checkShadowinput(params.inputs.RED);
        const colour_rgb_GREEN = checkShadowinput(params.inputs.GREEN);
        const colour_rgb_BLUE = checkShadowinput(params.inputs.BLUE);
        return {
          r: colour_rgb_RED,
          g: colour_rgb_GREEN,
          b: colour_rgb_BLUE,
        };

      case type === "colour_blend":
        const colour_blend_RATIO = checkShadowinput(params.inputs.RATIO);
        const colour_blend_COLOUR1 = hexToRgb(
          params.inputs.COLOUR1.shadow.fields.COLOUR
        );
        const colour_blend_COLOUR2 = hexToRgb(
          params.inputs.COLOUR2.shadow.fields.COLOUR
        );
        const colour_blend_COLOR1_r =
          colour_blend_COLOUR1.r * colour_blend_RATIO;
        const colour_blend_COLOR1_g =
          colour_blend_COLOUR1.g * colour_blend_RATIO;
        const colour_blend_COLOR1_b =
          colour_blend_COLOUR1.b * colour_blend_RATIO;

        const colour_blend_COLOR2_r = colour_blend_COLOUR2.r;
        const colour_blend_COLOR2_g = colour_blend_COLOUR2.g;
        const colour_blend_COLOR2_b = colour_blend_COLOUR2.b;

        const new_r =
          (colour_blend_COLOR2_r + colour_blend_COLOR1_r) /
          (colour_blend_RATIO + 1);
        const new_g =
          (colour_blend_COLOR2_g + colour_blend_COLOR1_g) /
          (colour_blend_RATIO + 1);
        const new_b =
          (colour_blend_COLOR2_b + colour_blend_COLOR1_b) /
          (colour_blend_RATIO + 1);

        return { r: new_r, g: new_g, b: new_b };

      /////////////////////////////////////////////Color///////////////////////////////////////////////////////////////
      case type === "ChangeLED":
        if (!params.inputs || !params.inputs.FIELD_ChangeLED) {

          throw new Error(`err: ChangeLED do not have input value! id: ${params.id}`);
          //appendActivity("Try running with incomplete ChangeLED");
        }
        var endpoint = "led";
        var colorBlock = getBlock(params.inputs.FIELD_ChangeLED);
        var COLOR = null;
        if (colorBlock?.fields?.COLOUR) {
          COLOR = hexToRgb(colorBlock.fields.COLOUR);
        } else {
          COLOR = compile(colorBlock, colorBlock.type);
        }
        
        var payload = {
          Red: COLOR.r,
          Green: COLOR.g,
          Blue: COLOR.b,
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(500);
        return;

      case type === "TransitionLED":
        if (!params.inputs || !params.inputs.COLOR1 || !params.inputs.COLOR2) {
          throw new Error(`err: TransitionLED do not have input value! id: ${params.id}`);
          //appendActivity("Try running with incomplete TransitionLED");
        }
        var endpoint = "led/transition";
        var colorBlock1 = getBlock(params.inputs.COLOR1);
        var colorBlock2 = getBlock(params.inputs.COLOR2);
        var COLOR1 = null;
        if (colorBlock1?.fields?.COLOUR) {
          COLOR1 = hexToRgb(colorBlock1.fields.COLOUR);
        } else {
          COLOR1 = compile(colorBlock1, colorBlock1.type);
        }
        
        var COLOR2 = null;
        if (colorBlock2?.fields?.COLOUR) {
          COLOR2 = hexToRgb(colorBlock2.fields.COLOUR);
        } else {
          COLOR2 = compile(colorBlock2, colorBlock2.type);
        }
        var time = params.fields.FIELD_TransitionTime_TimeMs * MS_TO_SEC;
        var transition = params.fields.TRANSITION_TYPE;
        var payload = {
          Red: COLOR1.r,
          Green: COLOR1.g,
          Blue: COLOR1.b,
          Red2: COLOR2.r,
          Green2: COLOR2.g,
          Blue2: COLOR2.b,
          TransitionType: transition,
          TimeMS: time,
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(time);
        return;

      case type === "DisplayImage":
        if (!params.inputs || !params.inputs.FIELD_DisplayImage_Filename) {
          throw new Error(`err: DisplayImage do not have input value! id: ${params.id}`);
          //appendActivity("Try running with incomplete DisplayImage");
        }
        var alpha = 1;
        var exprBlock = getBlock(params.inputs.FIELD_DisplayImage_Filename);
        var filename = FaceFilenameLookup(exprBlock.type);

        var endpoint = "images/display";
        var payload = {
          FileName: filename,
          Alpha: alpha,
        };

        // TODO: Uploading fails right now...
        // if (!mistyImageList.some(e => e.name === filename)) {
        //   var temp = getBase64(FaceLookup(filename));
        //   endpoint = "images";
        //   payload = {
        //     FileName: filename,
        //     File: temp,
        //     ImmediatelyApply: true,
        //     Overwrite: true,
        //   };
        // }

        sendPostRequestToRobot(endpoint, payload);
        delayJS(500);
        return;

      case type === "PlayAudio":
        if (!params.inputs || !params.inputs.FIELD_PlayAudio_Filename) {
          throw new Error(`err: PlayAudio do not have input value! id: ${params.id}`);
          //appendActivity("Try running with incomplete PlayAudio");
        }
        var endpoint = "audio/play";
        var exprBlock = getBlock(params.inputs.FIELD_PlayAudio_Filename);
        var filename = AudioLookup(exprBlock.type);
        var payload = {
          FileName: filename,
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(500);
        return;

      case type === "SetVolume":
        if (!params.inputs || !params.inputs.FIELD_Volume) {
          throw new Error(`err: SetVolume do not have input value! id: ${params.id}`);
        }
        var endpoint = "audio/volume";
        var volumeLevel = getBlock(params.inputs.FIELD_Volume);
        var payload = {
          Volume: volumeLevel,
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(500);
        return;

      case type === "DisplayAnimation":
        if (!params.inputs || !params.inputs.FIELD_DisplayAnimation_Filename) {
          throw new Error(`err: DisplayAnimation do not have input value! id: ${params.id}`);
          //appendActivity("Try running with incomplete DisplayAnimation");
        }
        var exprBlock = getBlock(params.inputs.FIELD_DisplayAnimation_Filename);
        var filename = AudioLookup(exprBlock.type);
        var payload = {
          FileName: filename,
        };
        readFile(payload);
        return;

      case type === "DisplayText":
        var endpoint = "text/display";
        var text = params.fields.FIELD_DisplayText_Text;
        var payload = {
          Text: text,
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(500);
        return;

      case type === "ClearText":
        var endpoint = "text/display";
        var payload = {
          Text: "",
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(500);
        return;

      case type === "TurnOnFlashlight":
        var endpoint = "flashlight";
        var payload = {
          On: true,
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(500);
        return;

      case type === "TurnOffFlashlight":
        var endpoint = "flashlight";
        var payload = {
          On: false,
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(500);
        return;

      case type === "WaitForSeconds":
        var time = parseFloat(params.fields.NumSeconds);
        delayJS(time * MS_TO_SEC);
        return;

      case type === "MoveArm":
        var arm =
          params.fields.FIELD_MoveArm_Arm === "Right" ? "Right" : "Left";
        var position = checkShadowinput(params.fields.FIELD_MoveArm_Position);
        var velocity = checkShadowinput(params.fields.FIELD_MoveArm_Velocity);
        var endpoint = "arms";
        var payload = {
          Arm: arm,
          Position: position,
          Velocity: velocity,
          Units: "Degrees",
        };
        sendPostRequestToRobot(endpoint, payload);
        var armTf = tfs[JointLookup(arm)];
        var euler = quaternionToEuler(armTf.rotation);
        var distance = 2 * PI * MISTY_ARM_LENGTH * Math.abs(euler.y - position);
        var time = distance / ((velocity / 100) * MAX_ARM_SPEED);
        var temp = {x: 0, y: position-ARM_OFFSET_ANGLE, z: 0};
        var newQuat = eulerToQuaternion(temp.x, temp.y * PI/180, temp.z);
        tfs[JointLookup(arm)].rotation.w = newQuat._w;
        tfs[JointLookup(arm)].rotation.x = newQuat._x;
        tfs[JointLookup(arm)].rotation.y = newQuat._y;
        tfs[JointLookup(arm)].rotation.z = newQuat._z;
        delayJS(time);
        return;

      case type === "MoveArm2":
        var position = checkShadowinput(params.fields.FIELD_MoveArm2_Position);
        var velocity = checkShadowinput(params.fields.FIELD_MoveArm2_Velocity);
        var endpoint = "arms";
        var payload = {
          Arm: "both",
          Position: position,
          Velocity: velocity,
          Units: "Degrees",
        };

        sendPostRequestToRobot(endpoint, payload);

        var lArmTf = tfs[JointLookup("Left")];
        var rArmTf = tfs[JointLookup("Right")];

        var lEuler = quaternionToEuler(lArmTf.rotation);
        var distance = 2 * PI * MISTY_ARM_LENGTH * Math.abs(lEuler.y - position);
        var lTime = distance / ((velocity / 100) * MAX_ARM_SPEED);

        var rEuler = quaternionToEuler(rArmTf.rotation);
        distance = 2 * PI * MISTY_ARM_LENGTH * Math.abs(rEuler.y - position);
        var rTime = distance / ((velocity / 100) * MAX_ARM_SPEED);

        
        var temp = {x: 0, y: position-ARM_OFFSET_ANGLE, z: 0};
        var lNewQuat = eulerToQuaternion(temp.x, temp.y * PI/180, temp.z);

        temp = { x: 0, y: position - ARM_OFFSET_ANGLE, z: 0 };
        var rNewQuat = eulerToQuaternion(temp.x, (temp.y * PI) / 180, temp.z);

        tfs[JointLookup("Left")].rotation.w = lNewQuat._w;
        tfs[JointLookup("Left")].rotation.x = lNewQuat._x;
        tfs[JointLookup("Left")].rotation.y = lNewQuat._y;
        tfs[JointLookup("Left")].rotation.z = lNewQuat._z;

        tfs[JointLookup("Right")].rotation.w = rNewQuat._w;
        tfs[JointLookup("Right")].rotation.x = rNewQuat._x;
        tfs[JointLookup("Right")].rotation.y = rNewQuat._y;
        tfs[JointLookup("Right")].rotation.z = rNewQuat._z;

        delayJS(Math.max(lTime, rTime));
        return;

      case type === "MoveArm3":
        var arm = params.fields.FIELD_MoveArm_Arm === "Right" ? "Right" : "Left";
        var position = checkShadowinput(params.fields.FIELD_MoveArm_Position);
        var velocity = checkShadowinput(params.fields.FIELD_MoveArm_Velocity);
        var endpoint = "arms";
        var payload = {
          Arm: arm,
          Position: position,
          Velocity: velocity,
          Units: "Degrees",
        };

        sendPostRequestToRobot(endpoint, payload);

        var armTf = tfs[JointLookup(arm)];
        var euler = quaternionToEuler(armTf.rotation);
        var distance = 2 * PI * MISTY_ARM_LENGTH * Math.abs(euler.y - position);
        var time = distance / ((velocity / 100) * MAX_ARM_SPEED);
        
        var temp = {x: 0, y: position-ARM_OFFSET_ANGLE, z: 0};
        var lNewQuat = eulerToQuaternion(temp.x, temp.y * PI/180, temp.z);
        tfs[JointLookup(arm)].rotation.w = lNewQuat._w;
        tfs[JointLookup(arm)].rotation.x = lNewQuat._x;
        tfs[JointLookup(arm)].rotation.y = lNewQuat._y;
        tfs[JointLookup(arm)].rotation.z = lNewQuat._z;

        delayJS(time);
        return;

      case type === "MoveArms2":
        var left_position = checkShadowinput(
          params.inputs.FIELD_MoveArm_LeftPosition
        );
        var left_velocity = checkShadowinput(
          params.inputs.FIELD_MoveArm_LeftVelocity
        );
        var right_position = checkShadowinput(
          params.inputs.FIELD_MoveArm_RightPosition
        );
        var right_velocity = checkShadowinput(
          params.inputs.FIELD_MoveArm_RightVelocity
        );
        var payload = {
          LeftArmPosition: left_position,
          RightArmPosition: right_position,
          LeftArmVelocity: left_velocity,
          RightArmVelocity: right_velocity,
          Units: "Degrees",
        };
        var endpoint = "arms/set";
        sendPostRequestToRobot(endpoint, payload);
        var lArmTf = tfs[JointLookup("Left")];
        var rArmTf = tfs[JointLookup("Right")];

        var lEuler = quaternionToEuler(lArmTf.rotation);
        var distance = 2 * PI * MISTY_ARM_LENGTH * Math.abs(lEuler.y - left_position);
        var lTime = distance / ((left_velocity / 100) * MAX_ARM_SPEED);

        var rEuler = quaternionToEuler(rArmTf.rotation);
        distance = 2 * PI * MISTY_ARM_LENGTH * Math.abs(rEuler.y - right_position);
        var rTime = distance / ((right_velocity / 100) * MAX_ARM_SPEED);

        
        var temp = {x: 0, y: left_position-ARM_OFFSET_ANGLE, z: 0};
        var lNewQuat = eulerToQuaternion(temp.x, temp.y * PI/180, temp.z);

        temp = {x: 0, y: right_position-ARM_OFFSET_ANGLE, z: 0};
        var rNewQuat = eulerToQuaternion(temp.x, temp.y * PI/180, temp.z);

        tfs[JointLookup("Left")].rotation.w = lNewQuat._w;
        tfs[JointLookup("Left")].rotation.x = lNewQuat._x;
        tfs[JointLookup("Left")].rotation.y = lNewQuat._y;
        tfs[JointLookup("Left")].rotation.z = lNewQuat._z;

        tfs[JointLookup("Right")].rotation.w = rNewQuat._w;
        tfs[JointLookup("Right")].rotation.x = rNewQuat._x;
        tfs[JointLookup("Right")].rotation.y = rNewQuat._y;
        tfs[JointLookup("Right")].rotation.z = rNewQuat._z;

        delayJS(Math.max(lTime, rTime));
        return;

      case type === "MoveHead":
        var pitch = params.fields.FIELD_MoveHead_Pitch === "D" ? 25 : -40;
        var endpoint = "head";
        var payload = {
          Pitch: pitch, //-5 - 5
          Yaw: 0,
          Roll: 0,
          Duration: 2,
          Units: "degrees",
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(2000);

        return;

      case type === "MoveHead3":
        var pitch, roll, yaw;
        var endpoint = "head";
        pitch = checkShadowinput(params.inputs.FIELD_MoveHead_Pitch);
        roll = checkShadowinput(params.inputs.FIELD_MoveHead_Roll);
        yaw = checkShadowinput(params.inputs.FIELD_MoveHead_Yaw);
        time = checkShadowinput(params.inputs.FIELD_MoveHead_Time);
        var payload = {
          Pitch: pitch,
          Yaw: yaw,
          Roll: roll,
          Duration: time,
          Units: "degrees",
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(time);
        return;

      case type === "DriveTime":
        var direction = params.fields.FIELD_DriveTime_Direction;
        var velocity = parseInt(params.fields.FIELD_DriveTime_Velocity);
        var time = parseInt(params.fields.FIELD_DriveTime_TimeMs) * MS_TO_SEC;
        var endpoint = "drive/time";
        var linearVelocity = direction === "F" ? velocity : -velocity;
        var payload = {
          LinearVelocity: linearVelocity,
          AngularVelocity: 0,
          TimeMs: time,
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(time);
        return;

      case type === "DriveTime2":
        var endpoint = "drive/time";
        var linearVelocity = checkShadowinput(
          params.inputs.FIELD_DriveTime_Velocity
        );
        var angularVelocity = checkShadowinput(
          params.inputs.FIELD_DriveTime_Angular
        );
        var time = checkShadowinput(params.inputs.FIELD_DriveTime_TimeMs) * MS_TO_SEC;
        var payload = {
          LinearVelocity: linearVelocity,
          AngularVelocity: angularVelocity,
          TimeMs: time,
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(time);
        return;

      case type === "Turn":
        var direction = params.fields.FIELD_Turn_Direction;
        var time = parseInt(params.fields.FIELD_Turn_Duration) * MS_TO_SEC;
        var angularVelocity = 100;
        var linearVelocity = 0;
        var degree = direction === "L" ? 90 : -90;
        var endpoint = "drive/time";
        var payload = {
          LinearVelocity: linearVelocity,
          AngularVelocity: angularVelocity,
          TimeMs: time,
          Degree: degree,
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(time);
        return;

      case type === "Turn2":
        var direction = params.fields.FIELD_Turn_Direction;
        var time = parseInt(checkShadowinput(params.inputs.FIELD_Turn_Duration));
        var angularVelocity = 100;
        var linearVelocity = 0;
        var degree = direction === "L" ? 90 : -90;
        var payload = {
          LinearVelocity: linearVelocity,
          AngularVelocity: angularVelocity,
          TimeMs: time,
          Degree: degree,
        };
        var endpoint = "drive/time";
        sendPostRequestToRobot(endpoint, payload);
        delayJS(time);
        return;

      case type == "Speak":
        var endpoint = "tts/speak";
        var textBlock = getBlock(params.inputs.FIELD_Speak_Text);
        var text = textBlock.fields.TEXT;
        var payload = {
          Text: `<speak>${text}</speak>`,
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(500);
        return;

      case type == "SpeakDefault":
        var endpoint = "tts/speak";
        var text = params.fields.FIELD_SpeakDefault_Text;
        var payload = {
          Text: `<speak>${text}</speak>`,
        };
        sendPostRequestToRobot(endpoint, payload);
        delayJS(500);
        return;

      default:
        return "No case match";
    }
  };

  // return { compile };
  const start = getBlocksByType("Start");
  let currParam = start;
  let num = 1;
  
  while (currParam && currParam.next) {
    num += 1;
    currParam = getBlock(currParam.next);
    compile(currParam, currParam.type);
  }
  var result = `${num} blocks compiled`;

  // Send data back to the main thread
  self.postMessage(result);
};