
const JointLookupTable = {
  "Left": "LEFT_ARM_CONNECTOR_1",
  "Right": "RIGHT_ARM_CONNECTOR_1",
  "Head": "HEAD_1",
  "Neck": "NECK_GLOBE_BASE_1",
  "Base": "base_link",
  
  // "package://misty_description/meshes/base_link.stl": base_link,
  // "package://misty_description/meshes/FACE_1.stl": FACE_1,
  // "package://misty_description/meshes/HEAD_1.stl": HEAD_1,
  // "package://misty_description/meshes/LEFT_ARM_CONNECTOR_1.stl": LEFT_ARM_CONNECTOR_1,
  // "package://misty_description/meshes/NECK_GLOBE_BASE_1.stl": NECK_GLOBE_BASE_1,
  // "package://misty_description/meshes/RIGHT_ARM_CONNECTOR_1.stl": RIGHT_ARM_CONNECTOR_1,
  // "package://misty_description/meshes/VISOR_GLASS_1.stl": VISOR_GLASS_1,
  };
  
  const JointLookup = (path) => JointLookupTable[path];
  export { JointLookupTable, JointLookup };