import { XMLParser } from 'fast-xml-parser';
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
const quaternionFromEuler = (vec3, axes = "szxy") => {
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

export function parseUrdfForJoints(urdfContent, items) {
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  };
  const parser = new XMLParser(options);

  const jsonObj = parser.parse(urdfContent);
  const joints = jsonObj.robot.joint;
  const jointsInfo = {};

  // Handling both single joint and multiple joints scenarios
  const jointArray = Array.isArray(joints) ? joints : [joints];

  jointArray.forEach((joint) => {
    const jointName = joint["@_name"];
    const origin = joint.origin;
    const parent = joint.parent["@_link"];
    const child = joint.child["@_link"];
    const xyz = origin["@_xyz"].split(' ').map(Number);
    const rpy = origin["@_rpy"].split(' ').map(Number);

    // Convert from Euler angles (rpy) to quaternion
    const quaternion = quaternionFromEuler(rpy, "sxyz");

    jointsInfo[child] = {
      frame: parent,
      position: { "x": xyz[0], "y": xyz[1], "z": xyz[2] },
      rotation: { "w": quaternion[0], "x": quaternion[1], "y": quaternion[2], "z": quaternion[3] },
      scale: { "x": 1, "y": 1, "z": 1 }
    };

  });
  jointsInfo["base_link"] = {
    frame: "world",
    position: { "x": 0, "y": 0, "z": 0 },
    rotation: { "w": 1, "x": 0, "y": 0, "z": 0 },
    scale: { "x": 1, "y": 1, "z": 1 }
  }

  console.log(jointsInfo);
  return jointsInfo;
}

export function parseUrdfForLinks(urdfContent) {
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: true, // Ensure numerical values are parsed
  };
  const parser = new XMLParser(options);

  const jsonObj = parser.parse(urdfContent);
  const links = jsonObj.robot.link;
  const materials = jsonObj.robot.material;
  const items = {}; // New dictionary to populate

  // Create a materials map
  const materialsMap = {};
  if (materials) {
    const materialArray = Array.isArray(materials) ? materials : [materials];
    materialArray.forEach(material => {
      const name = material["@_name"];
      const color = material.color["@_rgba"].split(' ').map(Number);
      materialsMap[name] = { "r": color[0], "g": color[1], "b": color[2], "a": color[3] };
    });
  }

  // Handling both single link and multiple links scenarios
  const linkArray = Array.isArray(links) ? links : [links];

  linkArray.forEach((link) => {
    const linkName = link["@_name"];
    const visual = link.visual;
    let geometry = null;
    let scale = null;
    if (visual?.geometry?.mesh) {
      geometry = visual.geometry.mesh["@_filename"];
      scale = visual.geometry.mesh["@_scale"]?.split(' ').map(Number)
    }
    if (linkName && visual && geometry) {
      let color;
      // Check if color is defined directly
      if (visual.material.color) {
        color = visual.material.color["@_rgba"].split(' ').map(Number);
      } else if (visual.material["@_name"] && materialsMap[visual.material["@_name"]]) {
        // Use material name to find color
        color = materialsMap[visual.material["@_name"]];
      } else {
        // Default color if none is found
        color = { "r": 1, "g": 1, "b": 1, "a": 1 };
      }
      // Assuming visual origin is always present
      const origin = visual.origin["@_xyz"].split(' ').map(Number);
      const rpy = visual.origin["@_rpy"].split(' ').map(Number);
      
      // Convert from Euler angles (rpy) to quaternion
      const quaternion = quaternionFromEuler(rpy, "sxyz");

      items[linkName] = {
        shape: geometry,
        name: linkName,
        frame: linkName,
        position: { "x": origin[0], "y": origin[1], "z": origin[2] },
        rotation: { "w": quaternion[0], "x": quaternion[1], "y": quaternion[2], "z": quaternion[3] },
        scale: scale? {"x": scale[0], "y": scale[1], "z": scale[2]}: { "x": 1, "y": 1, "z": 1 },
        highlight: "false"
      };
    }
  });

  return items; // Return the populated items dictionary
}