import BASE_FRONT_GRILL_1 from "./visual/BASE_FRONT_GRILL_1.js"
import BASE_LEFT_COVER_1 from "./visual/BASE_LEFT_COVER_1.js"
import base_link from "./visual/base_link.js"
import BASE_RIGHT_COVER_1 from "./visual/BASE_RIGHT_COVER_1.js"
import Battery_1 from "./visual/Battery_1.js"
import BODY_BASE_CONNECTOR_1 from "./visual/BODY_BASE_CONNECTOR_1.js"
import DRIVE_TRACK_LEFT_1 from "./visual/DRIVE_TRACK_LEFT_1.js"
import DRIVE_TRACK_RIGHT_1 from "./visual/DRIVE_TRACK_RIGHT_1.js"
import EYE_LENS_1 from "./visual/EYE_LENS_1.js"
import FACE_1 from "./visual/FACE_1.js"
import FRONT_LEFT_WHEEL_1 from "./visual/FRONT_LEFT_WHEEL_1.js"
import FRONT_RIGHT_WHEEL_1 from "./visual/FRONT_RIGHT_WHEEL_1.js"
import HEAD_1 from "./visual/HEAD_1.js"
import HEAD_VENT_LEFT_1 from "./visual/HEAD_VENT_LEFT_1.js"
import HEAD_VENT_RIGHT_1 from "./visual/HEAD_VENT_RIGHT_1.js"
import LEFT_ARM_1 from "./visual/LEFT_ARM_1.js"
import LEFT_ARM_CONNECTOR_1 from "./visual/LEFT_ARM_CONNECTOR_1.js"
import MIDDLE_LEFT_WHEEL_1 from "./visual/MIDDLE_LEFT_WHEEL_1.js"
import MIDDLE_RIGHT_WHEEL_1 from "./visual/MIDDLE_RIGHT_WHEEL_1.js"
import NECK_GLOBE_BASE_1 from "./visual/NECK_GLOBE_BASE_1.js"
import REAR_LEFT_WHEEL_1 from "./visual/REAR_LEFT_WHEEL_1.js"
import REAR_RIGHT_WHEEL_1 from "./visual/REAR_RIGHT_WHEEL_1.js"
import RIGHT_ARM_1 from "./visual/RIGHT_ARM_1.js"
import RIGHT_ARM_CONNECTOR_1 from "./visual/RIGHT_ARM_CONNECTOR_1.js"
import Torso_1 from "./visual/Torso_1.js"
import VISOR_GLASS_1 from "./visual/VISOR_GLASS_1.js"

const MeshLookupTable = {
  "package://misty_description/meshes/BASE_FRONT_GRILL_1.stl": BASE_FRONT_GRILL_1,
  "package://misty_description/meshes/BASE_LEFT_COVER_1.stl": BASE_LEFT_COVER_1,
  "package://misty_description/meshes/base_link.stl": base_link,
  "package://misty_description/meshes/BASE_RIGHT_COVER_1.stl": BASE_RIGHT_COVER_1,
  "package://misty_description/meshes/Battery_1.stl": Battery_1,
  "package://misty_description/meshes/BODY_BASE_CONNECTOR_1.stl": BODY_BASE_CONNECTOR_1,
  "package://misty_description/meshes/EYE_LENS_1.stl": EYE_LENS_1,
  "package://misty_description/meshes/FACE_1.stl": FACE_1,
  "package://misty_description/meshes/FRONT_LEFT_WHEEL_1.stl": FRONT_LEFT_WHEEL_1,
  "package://misty_description/meshes/FRONT_RIGHT_WHEEL_1.stl": FRONT_RIGHT_WHEEL_1,
  "package://misty_description/meshes/HEAD_1.stl": HEAD_1,
  "package://misty_description/meshes/HEAD_VENT_LEFT_1.stl": HEAD_VENT_LEFT_1,
  "package://misty_description/meshes/HEAD_VENT_RIGHT_1.stl": HEAD_VENT_RIGHT_1,
  "package://misty_description/meshes/LEFT_ARM_1.stl": LEFT_ARM_1,
  "package://misty_description/meshes/LEFT_ARM_CONNECTOR_1.stl": LEFT_ARM_CONNECTOR_1,
  "package://misty_description/meshes/MIDDLE_LEFT_WHEEL_1.stl": MIDDLE_LEFT_WHEEL_1,
  "package://misty_description/meshes/MIDDLE_RIGHT_WHEEL_1.stl": MIDDLE_RIGHT_WHEEL_1,
  "package://misty_description/meshes/NECK_GLOBE_BASE_1.stl": NECK_GLOBE_BASE_1,
  "package://misty_description/meshes/REAR_LEFT_WHEEL_1.stl": REAR_LEFT_WHEEL_1,
  "package://misty_description/meshes/REAR_RIGHT_WHEEL_1.stl": REAR_RIGHT_WHEEL_1,
  "package://misty_description/meshes/RIGHT_ARM_1.stl": RIGHT_ARM_1,
  "package://misty_description/meshes/RIGHT_ARM_CONNECTOR_1.stl": RIGHT_ARM_CONNECTOR_1,
  "package://misty_description/meshes/Torso_1.stl": Torso_1,
  "package://misty_description/meshes/VISOR_GLASS_1.stl": VISOR_GLASS_1,
};

const MeshLookup = (path) => MeshLookupTable[path]();
export { MeshLookupTable, MeshLookup };