
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

  // EXPRESSION FILES
  "e_Sleeping": "e_Sleeping.jpg",
  "e_SleepingZZZ": "e_SleepingZZZ.jpg",
  "e_Contempt": "e_Contempt.jpg",
  "e_ContentLeft": "e_ContentLeft.jpg",
  "e_ContentRight": "e_ContentRight.jpg",
  "e_Disoriented": "e_Disoriented.jpg",
  "e_EcstacyHilarious": "e_EcstacyHilarious.jpg",
  "e_EcstacyStarryEyed": "e_EcstacyStarryEyed.jpg",
  "e_JoyGoofy": "e_JoyGoofy.jpg",
  "e_JoyGoofy2": "e_JoyGoofy2.jpg",
  "e_JoyGoofy3": "e_JoyGoofy3.jpg",
  "e_Love": "e_Love.jpg",
  "e_Rage": "e_Rage.jpg",
  "e_Rage2": "e_Rage2.jpg",
  "e_Rage3": "e_Rage3.jpg",
  "e_Rage4": "e_Rage4.jpg",
  "e_RemorseShame": "e_RemorseShame.jpg",

  // AUDIO FILES
  "s_Acceptance" : "s_Acceptance.wav",
  "s_Amazement": "s_Amazement.wav",
  "s_Amazement2": "s_Amazement2.wav",
  "s_Anger": "s_Anger.wav",
  "s_Anger2": "s_Anger2.wav",
  "s_Anger3": "s_Anger3.wav",
  "s_Anger4": "s_Anger4.wav",
  "s_Annoyance": "s_Annoyance.wav",
  "s_Annoyance2": "s_Annoyance2.wav",
  "s_Annoyance3": "s_Annoyance3.wav",
  "s_Annoyance4": "s_Annoyance4.wav",
  "s_Awe": "s_Awe.wav",
  "s_Awe2": "s_Awe2.wav",
  "s_Awe3": "s_Awe3.wav",
  "s_Boredom": "s_Boredom.wav",
  "s_Disapproval": "s_Disapproval.wav",
  "s_Disgust": "s_Disgust.wav",
  "s_Disgust2": "s_Disgust2.wav",
  "s_Disgust3": "s_Disgust3.wav",
  "s_DisorientedConfused": "s_DisorientedConfused.wav",
  "s_DisorientedConfused2": "s_DisorientedConfused2.wav",
  "s_DisorientedConfused3": "s_DisorientedConfused3.wav",
  "s_DisorientedConfused4": "s_DisorientedConfused4.wav",
  "s_DisorientedConfused5": "s_DisorientedConfused5.wav",
  "s_DisorientedConfused6": "s_DisorientedConfused6.wav",
  "s_Distraction": "s_Distraction.wav",
  "s_Ecstacy": "s_Ecstacy.wav",
  "s_Ecstacy2": "s_Ecstacy2.wav",
  "s_Fear": "s_Fear.wav",
  "s_Grief": "s_Grief.wav",
  "s_Grief2": "s_Grief2.wav",
  "s_Grief3": "s_Grief3.wav",
  "s_Grief4": "s_Grief4.wav",
  "s_Joy": "s_Joy.wav",
  "s_Joy2": "s_Joy2.wav",
  "s_Joy3": "s_Joy3.wav",
  "s_Joy4": "s_Joy4.wav",
  "s_Loathing": "s_Loathing.wav",
  "s_Love": "s_Love.wav",
  "s_PhraseByeBye": "s_PhraseByeBye.wav",
  "s_PhraseEvilAhHa": "s_PhraseEvilAhHa.wav",
  "s_PhraseHello": "s_PhraseHello.wav",
  "s_PhraseNoNoNo": "s_PhraseNoNoNo.wav",
  "s_PhraseOopsy": "s_PhraseOopsy.wav",
  "s_PhraseOwOwOw": "s_PhraseOwOwOw.wav",
  "s_PhraseOwwww": "s_PhraseOwwww.wav",
  "s_PhraseUhOh": "s_PhraseUhOh.wav",
  "s_Rage": "s_Rage.wav",
  "s_Sadness": "s_Sadness.wav",
  "s_Sadness2": "s_Sadness2.wav",
  "s_Sadness3": "s_Sadness3.wav",
  "s_Sadness4": "s_Sadness4.wav",
  "s_Sadness5": "s_Sadness5.wav",
  "s_Sadness6": "s_Sadness6.wav",
  "s_Sadness7": "s_Sadness7.wav",
  "s_Sleepy": "s_Sleepy.wav",
  "s_Sleepy2": "s_Sleepy2.wav",
  "s_Sleepy3": "s_Sleepy3.wav",
  "s_Sleepy4": "s_Sleepy4.wav",
  "s_SleepySnore": "s_SleepySnore.wav",
  "s_SystemCameraShutter": "s_SystemCameraShutter.wav"

  };
  
  const JointLookup = (path) => JointLookupTable[path];
  export { JointLookupTable, JointLookup };