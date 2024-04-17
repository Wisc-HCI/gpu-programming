import { XMLParser } from 'fast-xml-parser';
import { quaternionFromEuler } from './utils.js';

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
        // Change this to a dict!
        let arrcolor = visual.material.color["@_rgba"].split(' ').map(Number);
        color = { "r": arrcolor[0], "g": arrcolor[1], "b": arrcolor[2], "a": arrcolor[3] };
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
        color: {"r": 0.7*255, "g": 0.7*255, "b": 0.7*255, "a": 1},
        scale: scale? {"x": scale[0], "y": scale[1], "z": scale[2]}: { "x": 1, "y": 1, "z": 1 },
        highlight: "false"
      };
    }
  });

  return items; // Return the populated items dictionary
}