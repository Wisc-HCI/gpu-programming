import { Quaternion, Euler } from "three";
import { PI, RAD_2_DEG } from './Constants';

const _AXES2TUPLE = {
    sxyz: [0, 0, 0, 0],
    sxyx: [0, 0, 1, 0],
    sxzy: [0, 1, 0, 0],
    sxzx: [0, 1, 1, 0],
    syzx: [1, 0, 0, 0],
    syzy: [1, 0, 1, 0],
    syxz: [1, 1, 0, 0],
    syxy: [1, 1, 1, 0],
    szxy: [2, 0, 0, 0],
    szxz: [2, 0, 1, 0],
    szyx: [2, 1, 0, 0],
    szyz: [2, 1, 1, 0],
    rzyx: [0, 0, 0, 1],
    rxyx: [0, 0, 1, 1],
    ryzx: [0, 1, 0, 1],
    rxzx: [0, 1, 1, 1],
    rxzy: [1, 0, 0, 1],
    ryzy: [1, 0, 1, 1],
    rzxy: [1, 1, 0, 1],
    ryxy: [1, 1, 1, 1],
    ryxz: [2, 0, 0, 1],
    rzxz: [2, 0, 1, 1],
    rxyz: [2, 1, 0, 1],
    rzyz: [2, 1, 1, 1],
};
const _NEXT_AXIS = [1, 2, 0, 1];
  
export function interpolateScalar(x, y) {
    //const defaultFn = (v) => 0;
    if (x.length <= 0) {
        return null;
    }
    const interp = (v) => {
        const val = v > x[x.length - 1] ? v % x[x.length - 1] : v;
        let lastIdx = 0;
        for (let i = 0; i < x.length; i++) {
        if (x[i] <= val) {
            lastIdx = i;
        } else {
            break;
        }
        }
        return y[lastIdx];
    };
    return interp;
}


export const quaternionFromEuler = (vec3, axes = "szxy") => {
    /*
  Return quaternion from Euler angles and axis sequence.
  ai, aj, ak : Euler's roll, pitch and yaw angles
  axes : One of 24 axis sequences as string or encoded tuple
  >>> q = quaternion_from_euler(1, 2, 3, 'ryxz')
  >>> numpy.allclose(q, [0.435953, 0.310622, -0.718287, 0.444435])
  True
  */
    let [ai, aj, ak] = [...vec3];
    let [firstaxis, parity, repetition, frame] = [
      ..._AXES2TUPLE[axes.toLowerCase()],
    ];
  
    let i = firstaxis + 1;
    let j = _NEXT_AXIS[i + parity - 1] + 1;
    let k = _NEXT_AXIS[i - parity] + 1;
  
    if (frame !== 0) {
      let values = [...[ai, ak]];
      ai = values[1];
      ak = values[0];
    }
    if (parity !== 0) {
      aj = -1 * aj;
    }
  
    ai = ai / 2.0;
    aj = aj / 2.0;
    ak = ak / 2.0;
    let ci = Math.cos(ai);
    let si = Math.sin(ai);
    let cj = Math.cos(aj);
    let sj = Math.sin(aj);
    let ck = Math.cos(ak);
    let sk = Math.sin(ak);
    let cc = ci * ck;
    let cs = ci * sk;
    let sc = si * ck;
    let ss = si * sk;
  
    let q = [null, null, null, null];
    if (repetition !== 0) {
      q[0] = cj * (cc - ss);
      q[i] = cj * (cs + sc);
      q[j] = sj * (cc + ss);
      q[k] = sj * (cs - sc);
    } else {
      q[0] = cj * cc + sj * ss;
      q[i] = cj * sc - sj * cs;
      q[j] = cj * ss + sj * cc;
      q[k] = cj * cs - sj * sc;
    }
  
    if (parity !== 0) {
      q[j] *= -1.0;
    }
  
    return q;
};

export const eulerToDegrees = (vec) => {
    return {x: vec.x * RAD_2_DEG, y: vec.y * RAD_2_DEG, z: vec.z * RAD_2_DEG};
};

export const quaternionToEuler = (quaternion) => {
    let tmp = eulerToDegrees(new Euler().setFromQuaternion(new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w)));
    return {x: tmp.x, y: tmp.y, z: tmp.z};
};

export const eulerToQuaternion = (x, y, z) => {
    let cx = Math.cos(x*0.5);
    let cy = Math.cos(y*0.5);    
    let cz = Math.cos(z*0.5);
    let sx = Math.sin(x*0.5);
    let sy = Math.sin(y*0.5);    
    let sz = Math.sin(z*0.5);

    let q = new Quaternion();
    q.w = (cz*cx*cy)+(sz*sx*sy);
    q.x = (cz*sx*cy)-(sz*cx*sy);
    q.y = (cz*cx*sy)+(sz*sx*cy);
    q.z = (sz*cx*cy)-(cz*sx*sy); 
    
    return q;
}


export const determineZAngleFromQuaternion = (quaternion) => {
  // Check for defaults
  if (quaternion._w === 0.707 && quaternion._z === 0.707) {
    return PI/2;
  }
  if (quaternion._w === 0.707 && quaternion._z === -0.707) {
    return -PI/2;
  }
  if (quaternion._w === -0.707 && quaternion._z === 0.707) {
    return 3*PI/4;
  }
  if (quaternion._w === -0.707 && quaternion._z === -0.707) {
    return -3*PI/4;
  }
  if (quaternion._z === 1) {
    return PI;
  }
  if (quaternion._z === -1) {
    return -PI;
  }
  // Otherwise return conversion
  return quaternionToEuler(quaternion).z;
}

export function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  console.log(result);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}