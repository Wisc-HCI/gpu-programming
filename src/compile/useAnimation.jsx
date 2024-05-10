import { ARM_OFFSET_ANGLE, MAX_ANGLE_PER_SEC, MAX_ARM_SPEED, MAX_DIST_PER_SEC, MISTY_ARM_LENGTH, MS_TO_SEC, PI, SIM_TIME } from "../Constants.js";
import { JointLookup } from "../Misty-Robot/JointLookup.js";
import { AudioLookup } from "../Misty-Robot/audio/audiolookup.js";
import { FaceFilenameLookup } from "../Misty-Robot/faces/facefilename.js";
import { FaceLookup } from "../Misty-Robot/faces/facemap.js";
import { Quaternion, Vector3 } from "three";
import { determineZAngleFromQuaternion, eulerToQuaternion, hexToRgb, interpolateScalar, quaternionToEuler } from "../utils.js";

const useAnimation = ({blocks, tfs}) => {
  var leftArm = tfs[JointLookup("Left")];
  var rightArm = tfs[JointLookup("Right")];
  var head = tfs[JointLookup("Head")];
  var base = tfs[JointLookup("Base")];

  let jointAnimationArrays = {
    "Left": {"x": [leftArm.rotation.x], "y": [leftArm.rotation.y], "z": [leftArm.rotation.z], "w": [leftArm.rotation.w]},
    "Right": {"x": [rightArm.rotation.x], "y": [rightArm.rotation.y], "z": [rightArm.rotation.z], "w": [rightArm.rotation.w]},
    "Head": {"x": [head.rotation.x], "y": [head.rotation.y], "z": [head.rotation.z], "w": [head.rotation.w]},
    "Base": {"position": {"x": [base.position.x], "y": [base.position.y], "z": [base.position.z]}, "rotation": {"x": [base.rotation.x], "y": [base.rotation.y], "z": [base.rotation.z], "w": [base.rotation.w]}},
    "Time": [0],
  }

  const addArmAnimationKeyFrame = (arm, position, velocity) => {
    if (arm === "both") {
        addArmsAnimationKeyFrame(position, velocity, position, velocity);
    } else {
        if (velocity > 0) {
            var armKey = arm;
            var oppositeArm = arm === "Left" ? "Right" : "Left";

            var armTf = {
                rotation: {
                    x: jointAnimationArrays[armKey]["x"][jointAnimationArrays[armKey]["x"].length-1],
                    y: jointAnimationArrays[armKey]["y"][jointAnimationArrays[armKey]["y"].length-1],
                    z: jointAnimationArrays[armKey]["z"][jointAnimationArrays[armKey]["z"].length-1],
                    w: jointAnimationArrays[armKey]["w"][jointAnimationArrays[armKey]["w"].length-1]
                }
            };
            var euler = quaternionToEuler(armTf.rotation);
            var distance = 2 * PI * MISTY_ARM_LENGTH * Math.abs(euler.y - position);
            var time = distance / ((velocity / 100) * MAX_ARM_SPEED);
            var temp = {x: 0, y: position-ARM_OFFSET_ANGLE, z: 0};
            var appends = 1;
            if ((temp.y < 0 && euler.y > 0) || (temp.y > 0 && euler.y < 0)) {
              let temp2 = (temp.y - euler.y) / 2.0;
              let midValue = temp.y - temp2;
              
              var midQuat = eulerToQuaternion(0, midValue * PI/180, 0);
              
              jointAnimationArrays[armKey]["w"].push(midQuat._w);
              jointAnimationArrays[armKey]["x"].push(midQuat._x);
              jointAnimationArrays[armKey]["y"].push(midQuat._y);
              jointAnimationArrays[armKey]["z"].push(midQuat._z);
              
              jointAnimationArrays["Time"].push(time/2.0);
              appends += 1;
            }

            var newQuat = eulerToQuaternion(temp.x, temp.y * PI/180, temp.z);
            jointAnimationArrays[armKey]["w"].push(newQuat._w);
            jointAnimationArrays[armKey]["x"].push(newQuat._x);
            jointAnimationArrays[armKey]["y"].push(newQuat._y);
            jointAnimationArrays[armKey]["z"].push(newQuat._z);
            
            for (let i = 0; i < appends; i++) {
              jointAnimationArrays[oppositeArm]["w"].push(jointAnimationArrays[oppositeArm]["w"][jointAnimationArrays[oppositeArm]["w"].length-1]);
              jointAnimationArrays[oppositeArm]["x"].push(jointAnimationArrays[oppositeArm]["x"][jointAnimationArrays[oppositeArm]["x"].length-1]);
              jointAnimationArrays[oppositeArm]["y"].push(jointAnimationArrays[oppositeArm]["y"][jointAnimationArrays[oppositeArm]["y"].length-1]);
              jointAnimationArrays[oppositeArm]["z"].push(jointAnimationArrays[oppositeArm]["z"][jointAnimationArrays[oppositeArm]["z"].length-1]);
              
              jointAnimationArrays["Head"]["x"].push(jointAnimationArrays["Head"]["x"][jointAnimationArrays["Head"]["x"].length-1]);
              jointAnimationArrays["Head"]["y"].push(jointAnimationArrays["Head"]["y"][jointAnimationArrays["Head"]["y"].length-1]);
              jointAnimationArrays["Head"]["z"].push(jointAnimationArrays["Head"]["z"][jointAnimationArrays["Head"]["z"].length-1]);
              jointAnimationArrays["Head"]["w"].push(jointAnimationArrays["Head"]["w"][jointAnimationArrays["Head"]["w"].length-1]);

              jointAnimationArrays["Base"]["position"]["x"].push(jointAnimationArrays["Base"]["position"]["x"][jointAnimationArrays["Base"]["position"]["x"].length-1]);
              jointAnimationArrays["Base"]["position"]["y"].push(jointAnimationArrays["Base"]["position"]["y"][jointAnimationArrays["Base"]["position"]["y"].length-1]);
              jointAnimationArrays["Base"]["position"]["z"].push(jointAnimationArrays["Base"]["position"]["z"][jointAnimationArrays["Base"]["position"]["z"].length-1]);

              jointAnimationArrays["Base"]["rotation"]["w"].push(jointAnimationArrays["Base"]["rotation"]["w"][jointAnimationArrays["Base"]["rotation"]["w"].length-1]);
              jointAnimationArrays["Base"]["rotation"]["x"].push(jointAnimationArrays["Base"]["rotation"]["x"][jointAnimationArrays["Base"]["rotation"]["x"].length-1]);
              jointAnimationArrays["Base"]["rotation"]["y"].push(jointAnimationArrays["Base"]["rotation"]["y"][jointAnimationArrays["Base"]["rotation"]["y"].length-1]);
              jointAnimationArrays["Base"]["rotation"]["z"].push(jointAnimationArrays["Base"]["rotation"]["z"][jointAnimationArrays["Base"]["rotation"]["z"].length-1]);
            }
            if (appends > 1) {
              jointAnimationArrays["Time"].push(time/2.0);
            } else {
              jointAnimationArrays["Time"].push(time);
            }
            
        }
    }
  }

  const addArmsAnimationKeyFrame = (left_position, left_velocity, right_position, right_velocity) => {
    if (left_velocity > 0 || right_velocity > 0) {
        var lArmTf = {
            rotation: {
                x: jointAnimationArrays["Left"]["x"][jointAnimationArrays["Left"]["x"].length-1],
                y: jointAnimationArrays["Left"]["y"][jointAnimationArrays["Left"]["y"].length-1],
                z: jointAnimationArrays["Left"]["z"][jointAnimationArrays["Left"]["z"].length-1],
                w: jointAnimationArrays["Left"]["w"][jointAnimationArrays["Left"]["w"].length-1]
            }
        };
        var rArmTf = {
            rotation: {
                x: jointAnimationArrays["Right"]["x"][jointAnimationArrays["Right"]["x"].length-1],
                y: jointAnimationArrays["Right"]["y"][jointAnimationArrays["Right"]["y"].length-1],
                z: jointAnimationArrays["Right"]["z"][jointAnimationArrays["Right"]["z"].length-1],
                w: jointAnimationArrays["Right"]["w"][jointAnimationArrays["Right"]["w"].length-1]
            }
        };

        var lEuler = quaternionToEuler(lArmTf.rotation);
        var distance = 2 * PI * MISTY_ARM_LENGTH * Math.abs(lEuler.y - left_position);
        var lTime = distance / ((left_velocity / 100) * MAX_ARM_SPEED);

        var rEuler = quaternionToEuler(rArmTf.rotation);
        var rDistance = 2 * PI * MISTY_ARM_LENGTH * Math.abs(rEuler.y - right_position);
        var rTime = rDistance / ((right_velocity / 100) * MAX_ARM_SPEED);

        var execTime = left_velocity === 0 ? rTime : right_velocity === 0 ? lTime : Math.max(lTime, rTime);
        
        var temp = {x: 0, y: left_position-ARM_OFFSET_ANGLE, z: 0};
        var lNewQuat = eulerToQuaternion(temp.x, temp.y * PI/180, temp.z);

        var temp2 = {x: 0, y: right_position-ARM_OFFSET_ANGLE, z: 0};
        var rNewQuat = eulerToQuaternion(temp2.x, temp2.y * PI/180, temp2.z);

        let appends = 1;
        
        if (((temp.y < 0 && lEuler.y > 0) || (temp.y > 0 && lEuler.y < 0)) || ((temp2.y < 0 && rEuler.y > 0) || (temp2.y > 0 && rEuler.y < 0))) {
          let temp3 = (temp.y - lEuler.y) / 2.0;
          let temp4 = (temp.y - lEuler.y) / 2.0;
          let lMidValue = temp.y - temp3;
          let rMidValue = temp2.y - temp4;
          
          var lMidQuat = eulerToQuaternion(0, lMidValue * PI/180, 0);
          var rMidQuat = eulerToQuaternion(0, rMidValue * PI/180, 0);

          if (left_velocity > 0) {
            jointAnimationArrays["Left"]["w"].push(lMidQuat._w);
            jointAnimationArrays["Left"]["x"].push(lMidQuat._x);
            jointAnimationArrays["Left"]["y"].push(lMidQuat._y);
            jointAnimationArrays["Left"]["z"].push(lMidQuat._z);    
          } else {
            jointAnimationArrays["Left"]["w"].push(jointAnimationArrays["Left"]["w"][jointAnimationArrays["Left"]["w"].length-1]);
            jointAnimationArrays["Left"]["x"].push(jointAnimationArrays["Left"]["x"][jointAnimationArrays["Left"]["x"].length-1]);
            jointAnimationArrays["Left"]["y"].push(jointAnimationArrays["Left"]["y"][jointAnimationArrays["Left"]["y"].length-1]);
            jointAnimationArrays["Left"]["z"].push(jointAnimationArrays["Left"]["z"][jointAnimationArrays["Left"]["z"].length-1]);
          }
        
          if (right_velocity > 0) {
            jointAnimationArrays["Right"]["w"].push(rMidQuat._w);
            jointAnimationArrays["Right"]["x"].push(rMidQuat._x);
            jointAnimationArrays["Right"]["y"].push(rMidQuat._y);
            jointAnimationArrays["Right"]["z"].push(rMidQuat._z);
          } else {
            jointAnimationArrays["Right"]["w"].push(jointAnimationArrays["Right"]["w"][jointAnimationArrays["Right"]["w"].length-1]);
            jointAnimationArrays["Right"]["x"].push(jointAnimationArrays["Right"]["x"][jointAnimationArrays["Right"]["x"].length-1]);
            jointAnimationArrays["Right"]["y"].push(jointAnimationArrays["Right"]["y"][jointAnimationArrays["Right"]["y"].length-1]);
            jointAnimationArrays["Right"]["z"].push(jointAnimationArrays["Right"]["z"][jointAnimationArrays["Right"]["z"].length-1]);
          }
          
          jointAnimationArrays["Time"].push(execTime/2.0);
          appends += 1;
        }

        if (left_velocity > 0) {
            jointAnimationArrays["Left"]["w"].push(lNewQuat._w);
            jointAnimationArrays["Left"]["x"].push(lNewQuat._x);
            jointAnimationArrays["Left"]["y"].push(lNewQuat._y);
            jointAnimationArrays["Left"]["z"].push(lNewQuat._z);    
        } else {
            jointAnimationArrays["Left"]["w"].push(jointAnimationArrays["Left"]["w"][jointAnimationArrays["Left"]["w"].length-1]);
            jointAnimationArrays["Left"]["x"].push(jointAnimationArrays["Left"]["x"][jointAnimationArrays["Left"]["x"].length-1]);
            jointAnimationArrays["Left"]["y"].push(jointAnimationArrays["Left"]["y"][jointAnimationArrays["Left"]["y"].length-1]);
            jointAnimationArrays["Left"]["z"].push(jointAnimationArrays["Left"]["z"][jointAnimationArrays["Left"]["z"].length-1]);
        }
        
        if (right_velocity > 0) {
            jointAnimationArrays["Right"]["w"].push(rNewQuat._w);
            jointAnimationArrays["Right"]["x"].push(rNewQuat._x);
            jointAnimationArrays["Right"]["y"].push(rNewQuat._y);
            jointAnimationArrays["Right"]["z"].push(rNewQuat._z);
        } else {
            jointAnimationArrays["Right"]["w"].push(jointAnimationArrays["Right"]["w"][jointAnimationArrays["Right"]["w"].length-1]);
            jointAnimationArrays["Right"]["x"].push(jointAnimationArrays["Right"]["x"][jointAnimationArrays["Right"]["x"].length-1]);
            jointAnimationArrays["Right"]["y"].push(jointAnimationArrays["Right"]["y"][jointAnimationArrays["Right"]["y"].length-1]);
            jointAnimationArrays["Right"]["z"].push(jointAnimationArrays["Right"]["z"][jointAnimationArrays["Right"]["z"].length-1]);
        }

        for (let i = 0; i < appends; i++) {
          jointAnimationArrays["Head"]["x"].push(jointAnimationArrays["Head"]["x"][jointAnimationArrays["Head"]["x"].length-1]);
          jointAnimationArrays["Head"]["y"].push(jointAnimationArrays["Head"]["y"][jointAnimationArrays["Head"]["y"].length-1]);
          jointAnimationArrays["Head"]["z"].push(jointAnimationArrays["Head"]["z"][jointAnimationArrays["Head"]["z"].length-1]);
          jointAnimationArrays["Head"]["w"].push(jointAnimationArrays["Head"]["w"][jointAnimationArrays["Head"]["w"].length-1]);
  
          jointAnimationArrays["Base"]["position"]["x"].push(jointAnimationArrays["Base"]["position"]["x"][jointAnimationArrays["Base"]["position"]["x"].length-1]);
          jointAnimationArrays["Base"]["position"]["y"].push(jointAnimationArrays["Base"]["position"]["y"][jointAnimationArrays["Base"]["position"]["y"].length-1]);
          jointAnimationArrays["Base"]["position"]["z"].push(jointAnimationArrays["Base"]["position"]["z"][jointAnimationArrays["Base"]["position"]["z"].length-1]);
  
          jointAnimationArrays["Base"]["rotation"]["w"].push(jointAnimationArrays["Base"]["rotation"]["w"][jointAnimationArrays["Base"]["rotation"]["w"].length-1]);
          jointAnimationArrays["Base"]["rotation"]["x"].push(jointAnimationArrays["Base"]["rotation"]["x"][jointAnimationArrays["Base"]["rotation"]["x"].length-1]);
          jointAnimationArrays["Base"]["rotation"]["y"].push(jointAnimationArrays["Base"]["rotation"]["y"][jointAnimationArrays["Base"]["rotation"]["y"].length-1]);
          jointAnimationArrays["Base"]["rotation"]["z"].push(jointAnimationArrays["Base"]["rotation"]["z"][jointAnimationArrays["Base"]["rotation"]["z"].length-1]);  
        }

        if (appends > 1) {
          jointAnimationArrays["Time"].push(execTime/2);
        } else {
          jointAnimationArrays["Time"].push(execTime);
        }
        
    }
  }

  const addHeadAnimationKeyFrame = (pitch, roll, yaw, time) => {
    if (time > 0) {
        var headQuat = eulerToQuaternion(roll * PI/180, pitch * PI/180, yaw * PI/180);
        
        jointAnimationArrays["Head"]["w"].push(headQuat._w);
        jointAnimationArrays["Head"]["x"].push(headQuat._x);
        jointAnimationArrays["Head"]["y"].push(headQuat._y);
        jointAnimationArrays["Head"]["z"].push(headQuat._z);
        
        jointAnimationArrays["Left"]["w"].push(jointAnimationArrays["Left"]["w"][jointAnimationArrays["Left"]["w"].length-1]);
        jointAnimationArrays["Left"]["x"].push(jointAnimationArrays["Left"]["x"][jointAnimationArrays["Left"]["x"].length-1]);
        jointAnimationArrays["Left"]["y"].push(jointAnimationArrays["Left"]["y"][jointAnimationArrays["Left"]["y"].length-1]);
        jointAnimationArrays["Left"]["z"].push(jointAnimationArrays["Left"]["z"][jointAnimationArrays["Left"]["z"].length-1]);
        jointAnimationArrays["Right"]["w"].push(jointAnimationArrays["Right"]["w"][jointAnimationArrays["Right"]["w"].length-1]);
        jointAnimationArrays["Right"]["x"].push(jointAnimationArrays["Right"]["x"][jointAnimationArrays["Right"]["x"].length-1]);
        jointAnimationArrays["Right"]["y"].push(jointAnimationArrays["Right"]["y"][jointAnimationArrays["Right"]["y"].length-1]);
        jointAnimationArrays["Right"]["z"].push(jointAnimationArrays["Right"]["z"][jointAnimationArrays["Right"]["z"].length-1]);
        
        jointAnimationArrays["Base"]["position"]["x"].push(jointAnimationArrays["Base"]["position"]["x"][jointAnimationArrays["Base"]["position"]["x"].length-1]);
        jointAnimationArrays["Base"]["position"]["y"].push(jointAnimationArrays["Base"]["position"]["y"][jointAnimationArrays["Base"]["position"]["y"].length-1]);
        jointAnimationArrays["Base"]["position"]["z"].push(jointAnimationArrays["Base"]["position"]["z"][jointAnimationArrays["Base"]["position"]["z"].length-1]);

        jointAnimationArrays["Base"]["rotation"]["w"].push(jointAnimationArrays["Base"]["rotation"]["w"][jointAnimationArrays["Base"]["rotation"]["w"].length-1]);
        jointAnimationArrays["Base"]["rotation"]["x"].push(jointAnimationArrays["Base"]["rotation"]["x"][jointAnimationArrays["Base"]["rotation"]["x"].length-1]);
        jointAnimationArrays["Base"]["rotation"]["y"].push(jointAnimationArrays["Base"]["rotation"]["y"][jointAnimationArrays["Base"]["rotation"]["y"].length-1]);
        jointAnimationArrays["Base"]["rotation"]["z"].push(jointAnimationArrays["Base"]["rotation"]["z"][jointAnimationArrays["Base"]["rotation"]["z"].length-1]);
        
        jointAnimationArrays["Time"].push(time);
    }
  }

  const addDriveAnimationKeyFrame = (linearVelocity, angularVelocity, time) => {
    if (time > 0) {
        // shit this wont work. you need to update tfs at each animation...so...you should be building this based on the jointAnimationArray
        var baseTf = {
            position: {
                x: jointAnimationArrays["Base"]["position"]["x"][jointAnimationArrays["Base"]["position"]["x"].length-1],
                y: jointAnimationArrays["Base"]["position"]["y"][jointAnimationArrays["Base"]["position"]["y"].length-1],
                z: jointAnimationArrays["Base"]["position"]["z"][jointAnimationArrays["Base"]["position"]["z"].length-1]
            },
            rotation: {
                x: jointAnimationArrays["Base"]["rotation"]["x"][jointAnimationArrays["Base"]["rotation"]["x"].length-1],
                y: jointAnimationArrays["Base"]["rotation"]["y"][jointAnimationArrays["Base"]["rotation"]["y"].length-1],
                z: jointAnimationArrays["Base"]["rotation"]["z"][jointAnimationArrays["Base"]["rotation"]["z"].length-1],
                w: jointAnimationArrays["Base"]["rotation"]["w"][jointAnimationArrays["Base"]["rotation"]["w"].length-1]
            }
        };
        var angle = (angularVelocity/100 * MAX_ANGLE_PER_SEC) * time/MS_TO_SEC;
        var distance = linearVelocity/100 * MAX_DIST_PER_SEC * time/MS_TO_SEC;
        var r = angle !== 0 ? distance/angle : distance;
        
        var newQuat = new Quaternion(baseTf.rotation.x, baseTf.rotation.y, baseTf.rotation.z, baseTf.rotation.w);
        var currentEulerZ = determineZAngleFromQuaternion(newQuat);
        if (angle !== 0) {
            var temp = {x: 0, y: 0, z: angle};
            newQuat = eulerToQuaternion(temp.x, temp.y, temp.z);
            newQuat.multiply(new Quaternion(baseTf.rotation.x, baseTf.rotation.y, baseTf.rotation.z, baseTf.rotation.w));
        }
        
        // offset to circle center
        let aX = baseTf.position.x;
        let aY = baseTf.position.y;
        if (angle > 0) {
          aX += r;
        } else if (angle < 0) {
          aX -= r;
        }

        let newPosition = null;
        if (angle !== 0) {
          newPosition = new Vector3(aX + (Math.cos(currentEulerZ) * distance / angle * Math.cos(distance)), aY + (Math.sin(currentEulerZ) * distance / angle * Math.sin(distance)), baseTf.position.z);
        } else {
          newPosition = new Vector3(aX + (Math.cos(currentEulerZ) * distance), aY + (Math.sin(currentEulerZ) * distance), baseTf.position.z);
        }

        jointAnimationArrays["Base"]["position"]["x"].push(newPosition.x);
        jointAnimationArrays["Base"]["position"]["y"].push(newPosition.y);
        jointAnimationArrays["Base"]["position"]["z"].push(newPosition.z);
        
        jointAnimationArrays["Base"]["rotation"]["w"].push(newQuat._w);
        jointAnimationArrays["Base"]["rotation"]["x"].push(newQuat._x);
        jointAnimationArrays["Base"]["rotation"]["y"].push(newQuat._y);
        jointAnimationArrays["Base"]["rotation"]["z"].push(newQuat._z);
        
        jointAnimationArrays["Head"]["x"].push(jointAnimationArrays["Head"]["x"][jointAnimationArrays["Head"]["x"].length-1]);
        jointAnimationArrays["Head"]["y"].push(jointAnimationArrays["Head"]["y"][jointAnimationArrays["Head"]["y"].length-1]);
        jointAnimationArrays["Head"]["z"].push(jointAnimationArrays["Head"]["z"][jointAnimationArrays["Head"]["z"].length-1]);
        jointAnimationArrays["Head"]["w"].push(jointAnimationArrays["Head"]["w"][jointAnimationArrays["Head"]["w"].length-1]);

        jointAnimationArrays["Left"]["w"].push(jointAnimationArrays["Left"]["w"][jointAnimationArrays["Left"]["w"].length-1]);
        jointAnimationArrays["Left"]["x"].push(jointAnimationArrays["Left"]["x"][jointAnimationArrays["Left"]["x"].length-1]);
        jointAnimationArrays["Left"]["y"].push(jointAnimationArrays["Left"]["y"][jointAnimationArrays["Left"]["y"].length-1]);
        jointAnimationArrays["Left"]["z"].push(jointAnimationArrays["Left"]["z"][jointAnimationArrays["Left"]["z"].length-1]);
        
        jointAnimationArrays["Right"]["w"].push(jointAnimationArrays["Right"]["w"][jointAnimationArrays["Right"]["w"].length-1]);
        jointAnimationArrays["Right"]["x"].push(jointAnimationArrays["Right"]["x"][jointAnimationArrays["Right"]["x"].length-1]);
        jointAnimationArrays["Right"]["y"].push(jointAnimationArrays["Right"]["y"][jointAnimationArrays["Right"]["y"].length-1]);
        jointAnimationArrays["Right"]["z"].push(jointAnimationArrays["Right"]["z"][jointAnimationArrays["Right"]["z"].length-1]);
        
        jointAnimationArrays["Time"].push(time);
    }
  }

  const bufferAnimation = (time) => {
    let lastElement = jointAnimationArrays["Head"]["x"].length-1;
    jointAnimationArrays["Base"]["position"]["x"].push(jointAnimationArrays["Base"]["position"]["x"][lastElement]);
    jointAnimationArrays["Base"]["position"]["y"].push(jointAnimationArrays["Base"]["position"]["y"][lastElement]);
    jointAnimationArrays["Base"]["position"]["z"].push(jointAnimationArrays["Base"]["position"]["z"][lastElement]);

    jointAnimationArrays["Base"]["rotation"]["w"].push(jointAnimationArrays["Base"]["rotation"]["w"][lastElement]);
    jointAnimationArrays["Base"]["rotation"]["x"].push(jointAnimationArrays["Base"]["rotation"]["x"][lastElement]);
    jointAnimationArrays["Base"]["rotation"]["y"].push(jointAnimationArrays["Base"]["rotation"]["y"][lastElement]);
    jointAnimationArrays["Base"]["rotation"]["z"].push(jointAnimationArrays["Base"]["rotation"]["z"][lastElement]);
    
    jointAnimationArrays["Head"]["x"].push(jointAnimationArrays["Head"]["x"][lastElement]);
    jointAnimationArrays["Head"]["y"].push(jointAnimationArrays["Head"]["y"][lastElement]);
    jointAnimationArrays["Head"]["z"].push(jointAnimationArrays["Head"]["z"][lastElement]);
    jointAnimationArrays["Head"]["w"].push(jointAnimationArrays["Head"]["w"][lastElement]);

    jointAnimationArrays["Left"]["w"].push(jointAnimationArrays["Left"]["w"][lastElement]);
    jointAnimationArrays["Left"]["x"].push(jointAnimationArrays["Left"]["x"][lastElement]);
    jointAnimationArrays["Left"]["y"].push(jointAnimationArrays["Left"]["y"][lastElement]);
    jointAnimationArrays["Left"]["z"].push(jointAnimationArrays["Left"]["z"][lastElement]);
    
    jointAnimationArrays["Right"]["w"].push(jointAnimationArrays["Right"]["w"][lastElement]);
    jointAnimationArrays["Right"]["x"].push(jointAnimationArrays["Right"]["x"][lastElement]);
    jointAnimationArrays["Right"]["y"].push(jointAnimationArrays["Right"]["y"][lastElement]);
    jointAnimationArrays["Right"]["z"].push(jointAnimationArrays["Right"]["z"][lastElement]);
    
    jointAnimationArrays["Time"].push(time);
  }

  const interpolateAnimationArray = () => {
    let newTfs = JSON.parse(JSON.stringify(tfs));
    let newEndingTfs = JSON.parse(JSON.stringify(tfs));

    let totalLength = jointAnimationArrays["Time"].length;
    let runningTimeSum = 0
    let timeVector = [];
    let leftArmWVector = [];
    let leftArmXVector = [];
    let leftArmYVector = [];
    let leftArmZVector = [];

    let rightArmWVector = [];
    let rightArmXVector = [];
    let rightArmYVector = [];
    let rightArmZVector = [];

    let headWVector = [];
    let headXVector = [];
    let headYVector = [];
    let headZVector = [];

    let basePositionXVector = [];
    let basePositionYVector = [];
    let basePositionZVector = [];

    let baseRotationWVector = [];
    let baseRotationXVector = [];
    let baseRotationYVector = [];
    let baseRotationZVector = [];

    for (let i = 1; i < totalLength; i++) {
      let time = jointAnimationArrays["Time"][i];
      
      let newLeftArmQuat = new Quaternion(jointAnimationArrays["Left"]["x"][i], jointAnimationArrays["Left"]["y"][i], jointAnimationArrays["Left"]["z"][i], jointAnimationArrays["Left"]["w"][i]);
      let newRightArmQuat = new Quaternion(jointAnimationArrays["Right"]["x"][i], jointAnimationArrays["Right"]["y"][i], jointAnimationArrays["Right"]["z"][i], jointAnimationArrays["Right"]["w"][i]);
      let newHeadQuat = new Quaternion(jointAnimationArrays["Head"]["x"][i], jointAnimationArrays["Head"]["y"][i], jointAnimationArrays["Head"]["z"][i], jointAnimationArrays["Head"]["w"][i]);
      let newBaseQuat = new Quaternion(jointAnimationArrays["Base"]["rotation"]["x"][i], jointAnimationArrays["Base"]["rotation"]["y"][i], jointAnimationArrays["Base"]["rotation"]["z"][i], jointAnimationArrays["Base"]["rotation"]["w"][i]);
      let newBaseVec = new Vector3(jointAnimationArrays["Base"]["position"]["x"][i], jointAnimationArrays["Base"]["position"]["y"][i], jointAnimationArrays["Base"]["position"]["z"][i]);

      for (let j = 10; j < SIM_TIME; j += 10) {
        timeVector.push((time/MS_TO_SEC * j) + runningTimeSum);
        let oldLeftArmQuat = new Quaternion(jointAnimationArrays["Left"]["x"][i-1], jointAnimationArrays["Left"]["y"][i-1], jointAnimationArrays["Left"]["z"][i-1], jointAnimationArrays["Left"]["w"][i-1]);
        let oldRightArmQuat = new Quaternion(jointAnimationArrays["Right"]["x"][i-1], jointAnimationArrays["Right"]["y"][i-1], jointAnimationArrays["Right"]["z"][i-1], jointAnimationArrays["Right"]["w"][i-1]);
        let oldHeadQuat = new Quaternion(jointAnimationArrays["Head"]["x"][i-1], jointAnimationArrays["Head"]["y"][i-1], jointAnimationArrays["Head"]["z"][i-1], jointAnimationArrays["Head"]["w"][i-1]);
        let oldBaseQuat = new Quaternion(jointAnimationArrays["Base"]["rotation"]["x"][i-1], jointAnimationArrays["Base"]["rotation"]["y"][i-1], jointAnimationArrays["Base"]["rotation"]["z"][i-1], jointAnimationArrays["Base"]["rotation"]["w"][i-1]);
        let oldBaseVec = new Vector3(jointAnimationArrays["Base"]["position"]["x"][i-1], jointAnimationArrays["Base"]["position"]["y"][i-1], jointAnimationArrays["Base"]["position"]["z"][i-1]);

        oldLeftArmQuat.slerp(newLeftArmQuat, j/SIM_TIME);
        oldRightArmQuat.slerp(newRightArmQuat, j/SIM_TIME);
        oldHeadQuat.slerp(newHeadQuat, j/SIM_TIME);

        // TODO: cannot lerp/slerp....need to calculate each frame manually.
        oldBaseQuat.slerp(newBaseQuat, j/SIM_TIME);
        oldBaseVec.lerp(newBaseVec, j/SIM_TIME);

        leftArmWVector.push(oldLeftArmQuat._w);
        leftArmXVector.push(oldLeftArmQuat._x);
        leftArmYVector.push(oldLeftArmQuat._y);
        leftArmZVector.push(oldLeftArmQuat._z);

        rightArmWVector.push(oldRightArmQuat._w);
        rightArmXVector.push(oldRightArmQuat._x);
        rightArmYVector.push(oldRightArmQuat._y);
        rightArmZVector.push(oldRightArmQuat._z);

        headWVector.push(oldHeadQuat._w);
        headXVector.push(oldHeadQuat._x);
        headYVector.push(oldHeadQuat._y);
        headZVector.push(oldHeadQuat._z);

        basePositionXVector.push(oldBaseVec.x);
        basePositionYVector.push(oldBaseVec.y);
        basePositionZVector.push(oldBaseVec.z);

        baseRotationWVector.push(oldBaseQuat._w);
        baseRotationXVector.push(oldBaseQuat._x);
        baseRotationYVector.push(oldBaseQuat._y);
        baseRotationZVector.push(oldBaseQuat._z);
      }
      runningTimeSum += time;
    }

    let finalLeftArmQuat = new Quaternion(jointAnimationArrays["Left"]["x"][totalLength-1], jointAnimationArrays["Left"]["y"][totalLength-1], jointAnimationArrays["Left"]["z"][totalLength-1], jointAnimationArrays["Left"]["w"][totalLength-1]);
    let finalRightArmQuat = new Quaternion(jointAnimationArrays["Right"]["x"][totalLength-1], jointAnimationArrays["Right"]["y"][totalLength-1], jointAnimationArrays["Right"]["z"][totalLength-1], jointAnimationArrays["Right"]["w"][totalLength-1]);
    let finalHeadQuat = new Quaternion(jointAnimationArrays["Head"]["x"][totalLength-1], jointAnimationArrays["Head"]["y"][totalLength-1], jointAnimationArrays["Head"]["z"][totalLength-1], jointAnimationArrays["Head"]["w"][totalLength-1]);
    let finalBaseQuat = new Quaternion(jointAnimationArrays["Base"]["rotation"]["x"][totalLength-1], jointAnimationArrays["Base"]["rotation"]["y"][totalLength-1], jointAnimationArrays["Base"]["rotation"]["z"][totalLength-1], jointAnimationArrays["Base"]["rotation"]["w"][totalLength-1]);
    let finalBaseVec = new Vector3(jointAnimationArrays["Base"]["position"]["x"][totalLength-1], jointAnimationArrays["Base"]["position"]["y"][totalLength-1], jointAnimationArrays["Base"]["position"]["z"][totalLength-1]);

    timeVector.push(Infinity);
    leftArmWVector.push(finalLeftArmQuat._w);
    leftArmXVector.push(finalLeftArmQuat._x);
    leftArmYVector.push(finalLeftArmQuat._y);
    leftArmZVector.push(finalLeftArmQuat._z);

    rightArmWVector.push(finalRightArmQuat._w);
    rightArmXVector.push(finalRightArmQuat._x);
    rightArmYVector.push(finalRightArmQuat._y);
    rightArmZVector.push(finalRightArmQuat._z);
    
    headWVector.push(finalHeadQuat._w);
    headXVector.push(finalHeadQuat._x);
    headYVector.push(finalHeadQuat._y);
    headZVector.push(finalHeadQuat._z);
    
    basePositionXVector.push(finalBaseVec.x);
    basePositionYVector.push(finalBaseVec.y);
    basePositionZVector.push(finalBaseVec.z);

    baseRotationWVector.push(finalBaseQuat._w);
    baseRotationXVector.push(finalBaseQuat._x);
    baseRotationYVector.push(finalBaseQuat._y);
    baseRotationZVector.push(finalBaseQuat._z);

    newTfs[JointLookup("Left")].rotation.w = interpolateScalar(timeVector, leftArmWVector);
    newTfs[JointLookup("Left")].rotation.x = interpolateScalar(timeVector, leftArmXVector);
    newTfs[JointLookup("Left")].rotation.y = interpolateScalar(timeVector, leftArmYVector);
    newTfs[JointLookup("Left")].rotation.z = interpolateScalar(timeVector, leftArmZVector);
    newEndingTfs[JointLookup("Left")].rotation.w = finalLeftArmQuat._w;
    newEndingTfs[JointLookup("Left")].rotation.x = finalLeftArmQuat._x;
    newEndingTfs[JointLookup("Left")].rotation.y = finalLeftArmQuat._y;
    newEndingTfs[JointLookup("Left")].rotation.z = finalLeftArmQuat._z;
    
    newTfs[JointLookup("Right")].rotation.w = interpolateScalar(timeVector, rightArmWVector);
    newTfs[JointLookup("Right")].rotation.x = interpolateScalar(timeVector, rightArmXVector);
    newTfs[JointLookup("Right")].rotation.y = interpolateScalar(timeVector, rightArmYVector);
    newTfs[JointLookup("Right")].rotation.z = interpolateScalar(timeVector, rightArmZVector);
    newEndingTfs[JointLookup("Right")].rotation.w = finalRightArmQuat._w;
    newEndingTfs[JointLookup("Right")].rotation.x = finalRightArmQuat._x;
    newEndingTfs[JointLookup("Right")].rotation.y = finalRightArmQuat._y;
    newEndingTfs[JointLookup("Right")].rotation.z = finalRightArmQuat._z;

    newTfs[JointLookup("Head")].rotation.w = interpolateScalar(timeVector, headWVector);
    newTfs[JointLookup("Head")].rotation.x = interpolateScalar(timeVector, headXVector);
    newTfs[JointLookup("Head")].rotation.y = interpolateScalar(timeVector, headYVector);
    newTfs[JointLookup("Head")].rotation.z = interpolateScalar(timeVector, headZVector);
    newEndingTfs[JointLookup("Head")].rotation.w = finalHeadQuat._w;
    newEndingTfs[JointLookup("Head")].rotation.x = finalHeadQuat._x;
    newEndingTfs[JointLookup("Head")].rotation.y = finalHeadQuat._y;
    newEndingTfs[JointLookup("Head")].rotation.z = finalHeadQuat._z;


    newTfs[JointLookup("Base")].rotation.w = interpolateScalar(timeVector, baseRotationWVector);
    newTfs[JointLookup("Base")].rotation.x = interpolateScalar(timeVector, baseRotationXVector);
    newTfs[JointLookup("Base")].rotation.y = interpolateScalar(timeVector, baseRotationYVector);
    newTfs[JointLookup("Base")].rotation.z = interpolateScalar(timeVector, baseRotationZVector);
    newTfs[JointLookup("Base")].position.x = interpolateScalar(timeVector, basePositionXVector);
    newTfs[JointLookup("Base")].position.y = interpolateScalar(timeVector, basePositionYVector);
    newTfs[JointLookup("Base")].position.z = interpolateScalar(timeVector, basePositionZVector);
    newEndingTfs[JointLookup("Base")].rotation.w = finalBaseQuat._w;
    newEndingTfs[JointLookup("Base")].rotation.x = finalBaseQuat._x;
    newEndingTfs[JointLookup("Base")].rotation.y = finalBaseQuat._y;
    newEndingTfs[JointLookup("Base")].rotation.z = finalBaseQuat._z;
    newEndingTfs[JointLookup("Base")].position.x = finalBaseVec.x;
    newEndingTfs[JointLookup("Base")].position.y = finalBaseVec.y;
    newEndingTfs[JointLookup("Base")].position.z = finalBaseVec.z;

    return {newTfs, newEndingTfs};
  }

  const getBlocksByType = (type) => {
    return Object.values(blocks).filter((block) => block.type === type)[0];
  };
  const getBlock = (id) => blocks[id];

  // Fixed case-sensitive function call
  const ifDo = (IF0, DO0) => {
    const ifInput = getBlock(IF0);
    let doInput = getBlock(DO0);
    // Check if input is logically true
    if (animate(ifInput, ifInput.type)) {
      //if true, iteratively run blocks
      animate(doInput, doInput.type);
      while (doInput.next) {
        doInput = getBlock(doInput.next);

        animate(doInput, doInput.type);
      }
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

  function isPrime(num) {
    if (num === 2 || num === 3) return true;
    if (num <= 1 || num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  }

  function checkShadowinput(input) {
    if (typeof input !== "string") {
      return input.shadow.fields.NUM;
    } else {
      let block = getBlock(input);
      return animate(block, block.type);
    }
  }

  const animate = (params, type) => {

    switch (true) {
      case type === "controls_if":
        if (!params.inputs || !params.inputs.IF0 || !params.inputs.DO0) {
          throw new Error("err: controls_if not complete!");
        } else {
          ifDo(params.inputs.IF0, params.inputs.DO0);
        }
        break;

      case type === "logic_boolean":
        return logicBoolean(params.fields.BOOL);

      case type === "logic_compare":
        if (!params.inputs || !params.inputs.A || !params.inputs.B) {
          throw new Error("err: logic_compare is not complete!");
        }
        //get the two input and see if they are logically equal
        const logic_compare_oprand = params.fields.OP;
        const logic_compare_A_id = params.inputs.A;
        const logic_compare_B_id = params.inputs.B;
        const logic_compare_A_params = getBlock(logic_compare_A_id);
        const logic_compare_B_params = getBlock(logic_compare_B_id);
        if (logic_compare_oprand === "EQ") {
          return (
            animate(logic_compare_A_params, logic_compare_A_params.type) ==
            animate(logic_compare_B_params, logic_compare_B_params.type)
          );
        } else if (logic_compare_oprand === "NEQ") {
          return (
            animate(logic_compare_A_params, logic_compare_A_params.type) !==
            animate(logic_compare_B_params, logic_compare_B_params.type)
          );
        } else if (logic_compare_oprand === "LT") {
          return (
            animate(logic_compare_A_params, logic_compare_A_params.type) <
            animate(logic_compare_B_params, logic_compare_B_params.type)
          );
        } else if (logic_compare_oprand === "LTE") {
          return (
            animate(logic_compare_A_params, logic_compare_A_params.type) <=
            animate(logic_compare_B_params, logic_compare_B_params.type)
          );
        } else if (logic_compare_oprand === "GT") {
          return (
            animate(logic_compare_A_params, logic_compare_A_params.type) >
            animate(logic_compare_B_params, logic_compare_B_params.type)
          );
        } else if (logic_compare_oprand === "GTE") {
          return (
            animate(logic_compare_A_params, logic_compare_A_params.type) >=
            animate(logic_compare_B_params, logic_compare_B_params.type)
          );
        }

      /* eslint-disable-next-line no-fallthrough */
      case type === "logic_operation":
        if (!params.inputs || !params.inputs.A || !params.inputs.B) {
          throw new Error("err: logic_operation is not complete!");
        }

        const oprand = params.fields.OP;
        const logic_operation_A_id = params.inputs.A;
        const logic_operation_B_id = params.inputs.B;
        const logic_operation_A_params = getBlock(logic_operation_A_id);
        const logic_operation_B_params = getBlock(logic_operation_B_id);
        if (oprand === "OR") {
          return (
            animate(logic_operation_A_params, logic_operation_A_params.type) ||
            animate(logic_operation_B_params, logic_operation_B_params.type)
          );
        } else {
          //oprand is and
          return (
            animate(logic_operation_A_params, logic_operation_A_params.type) &&
            animate(logic_operation_B_params, logic_operation_B_params.type)
          );
        }

      case type === "logic_negate":
        if (!params.inputs) {
          throw new Error("err: logic_negate is not complete!");
        }
        const logic_negate_BOOL = getBlock(params.inputs.BOOL);
        return !animate(logic_negate_BOOL, logic_negate_BOOL.type);

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
          throw new Error("err: logic_ternary is not complete!");
          //appendActivity("Try running with incomplete logic_ternary");
          return;
        }
        const logic_ternary_IF_id = params.inputs.IF;
        const logic_ternary_THEN_id = params.inputs.THEN;
        const logic_ternary_ELSE_id = params.inputs.ELSE;
        const logic_ternary_IF_params = getBlock(logic_ternary_IF_id);
        const logic_ternary_THEN_params = getBlock(logic_ternary_THEN_id);
        const logic_ternary_ELSE_params = getBlock(logic_ternary_ELSE_id);
        const logic_ternary_condition = animate(
          logic_ternary_IF_params,
          logic_ternary_IF_params.type
        );
        //if the condition is true
        if (logic_ternary_condition) {
          return animate(
            logic_ternary_THEN_params,
            logic_ternary_THEN_params.type
          );
        } else {
          return animate(
            logic_ternary_ELSE_params,
            logic_ternary_ELSE_params.type
          );
        }

      /////////////////////////////////////////////LOGIC///////////////////////////////////////////////////////////////

      case type === "controls_repeat_ext":
        const controls_repeat_ext_TIMES = checkShadowinput(params.inputs.TIMES);
        if (!params.inputs.DO) {
          throw new Error("err: controls_repeat_ext is not complete!");
        }
        let controls_repeat_ext_DO_params = getBlock(params.inputs.DO);
        for (let i = 0; i < controls_repeat_ext_TIMES; i++) {
          animate(
            controls_repeat_ext_DO_params,
            controls_repeat_ext_DO_params.type
          );
          let currBlock = controls_repeat_ext_DO_params;
          while (currBlock.next) {
            currBlock = getBlock(currBlock.next);
            animate(currBlock, currBlock.type);
          }
        }
        return;

      /////////////////////////////////////////////LOOP////////////////////////////////////////////////////////////////

      case type === "math_number":
        return params.fields.NUM;

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
        // Todo, add new item????? to display led color....
        if (!params.inputs || !params.inputs.FIELD_ChangeLED) {
            // todo: keep list of errors and push at end instead of now!!!!
          throw new Error("err: ChangeLED is not complete!");
        }
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
        return;

      case type === "TransitionLED":
        // Todo, add new item????? to display led color....
        if (!params.inputs || !params.inputs.COLOR1 || !params.inputs.COLOR2) {
            // todo: keep list of errors and push at end instead of now!!!!
          throw new Error("err: TransitionLED is not complete!");
        }
        var colorBlock1 = getBlock(params.inputs.COLOR1);
        var colorBlock2 = getBlock(params.inputs.COLOR2);
        var COLOR1 = null;
        if (colorBlock1?.fields?.COLOUR) {
          COLOR1 = hexToRgb(colorBlock1.fields.COLOUR);
        } else {
          COLOR1 = animate(colorBlock1, colorBlock1.type);
        }
        
        var COLOR2 = null;
        if (colorBlock2?.fields?.COLOUR) {
          COLOR2 = hexToRgb(colorBlock2.fields.COLOUR);
        } else {
          COLOR2 = animate(colorBlock2, colorBlock2.type);
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
        return;

      case type === "DisplayImage":
        // Todo, display image on robot....
        if (!params.inputs || !params.inputs.FIELD_DisplayImage_Filename) {
            // todo: keep list of errors and push at end instead of now!!!!
          throw new Error("err: DisplayImage is not complete!");
        }
        var alpha = 1;
        var exprBlock = getBlock(params.inputs.FIELD_DisplayImage_Filename);
        var filename = FaceFilenameLookup(exprBlock.type);
        return;

      case type === "PlayAudio":
        // Todo, how to play audio in browser???? and how to play it at the correct time??? add a sleep for sum of time till play?
        if (!params.inputs || !params.inputs.FIELD_PlayAudio_Filename) {
            // todo: keep list of errors and push at end instead of now!!!!
          throw new Error("err: PlayAudio is not complete!");
        }
        var endpoint = "audio/play";
        var exprBlock = getBlock(params.inputs.FIELD_PlayAudio_Filename);
        var filename = AudioLookup(exprBlock.type);
        return;

      case type === "DisplayAnimation":
        if (!params.inputs || !params.inputs.FIELD_DisplayAnimation_Filename) {
            // todo: keep list of errors and push at end instead of now!!!!
          throw new Error("err: DisplayAnimation is not complete!");
          return;
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
        // Todo, add new item????? to display text on screen....
        var text = params.fields.FIELD_DisplayText_Text;
        return;

      case type === "TurnOnFlashlight":
        return;

      case type === "TurnOffFlashlight":
        // Todo, add new item????? to display light....
        return;

      case type === "WaitForSeconds":
        var time = parseFloat(params.fields.NumSeconds) * MS_TO_SEC;
        bufferAnimation(time);
        return;

      case type === "MoveArm":
        var arm =
          params.fields.FIELD_MoveArm_Arm === "Right" ? "Right" : "Left";
        var position = parseInt(params.fields.FIELD_MoveArm_Position);
        var velocity = parseInt(params.fields.FIELD_MoveArm_Velocity);
        addArmAnimationKeyFrame(arm, position, velocity);
        return;

      case type === "MoveArm2":
        var position = parseInt(params.fields.FIELD_MoveArm2_Position);
        var velocity = parseInt(params.fields.FIELD_MoveArm2_Velocity);
        var arm = "both";
        addArmAnimationKeyFrame(arm, position, velocity);
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
        addArmsAnimationKeyFrame(left_position, left_velocity, right_position, right_velocity);
        return;

      case type === "MoveHead":
        var pitch = params.fields.FIELD_MoveHead_Pitch === "D" ? 25 : -40;
        var time = 2000;
        addHeadAnimationKeyFrame(pitch, 0, 0, time);
        return;

      case type === "MoveHead3":
        var pitch, roll, yaw;
        pitch = checkShadowinput(params.inputs.FIELD_MoveHead_Pitch);
        roll = checkShadowinput(params.inputs.FIELD_MoveHead_Roll);
        yaw = checkShadowinput(params.inputs.FIELD_MoveHead_Yaw);
        time = checkShadowinput(params.inputs.FIELD_MoveHead_Time) * MS_TO_SEC;
        addHeadAnimationKeyFrame(pitch, roll, yaw, time);
        return;

      case type === "DriveTime":
        var direction = params.fields.FIELD_DriveTime_Direction;
        var velocity = parseInt(params.fields.FIELD_DriveTime_Velocity);
        var time = parseInt(params.fields.FIELD_DriveTime_TimeMs) * MS_TO_SEC;
        var linearVelocity = direction === "F" ? velocity : -velocity;
        addDriveAnimationKeyFrame(linearVelocity, 0, time);
        return;

      case type === "DriveTime2":
        var linearVelocity = checkShadowinput(
          params.inputs.FIELD_DriveTime_Velocity
        );
        var angularVelocity = checkShadowinput(
          params.inputs.FIELD_DriveTime_Angular
        );
        var time = checkShadowinput(params.inputs.FIELD_DriveTime_TimeMs) * MS_TO_SEC;
        addDriveAnimationKeyFrame(linearVelocity, angularVelocity, time);
        return;

      case type === "Turn":
        var direction = params.fields.FIELD_Turn_Direction;
        var time = parseInt(params.fields.FIELD_Turn_Duration) * MS_TO_SEC;
        var angularVelocity = direction === "L" ? 100 : -100;
        addDriveAnimationKeyFrame(0, angularVelocity, time);
        return;

      case type === "Turn2":
        var direction = params.fields.FIELD_Turn_Direction;
        var time = parseInt(checkShadowinput(params.inputs.FIELD_Turn_Duration)) * MS_TO_SEC;
        var angularVelocity = direction === "L" ? 100 : -100;
        addDriveAnimationKeyFrame(0, angularVelocity, time);
        return;

      case type == "Speak":
        // Todo, add new item????? to display text, then need to backtrack time....
        var textBlock = getBlock(params.inputs.FIELD_Speak_Text);
        var text = textBlock.fields.TEXT;
        return;

      case type == "SpeakDefault":
        // Todo, add new item????? to display text, then need to backtrack time....
        var text = params.fields.FIELD_SpeakDefault_Text;
        return;

      default:
        return;
    }
  };

  // return { animate };
  const start = getBlocksByType("Start");
  let currParam = start;
  let num = 1;
  
  while (currParam && currParam.next) {
    num += 1;
    currParam = getBlock(currParam.next);
    animate(currParam, currParam.type);
  }

  console.log(jointAnimationArrays);

  // Send data back to the main thread
  return interpolateAnimationArray()
};

export default useAnimation;