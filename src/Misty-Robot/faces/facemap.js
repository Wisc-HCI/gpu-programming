import e_Sleeping from './e_Sleeping.jpg';
import e_SleepingZZZ from './e_SleepingZZZ.jpg';
import e_Contempt from './e_Contempt.jpg';
import e_ContentLeft from './e_ContentLeft.jpg';
import e_ContentRight from './e_ContentRight.jpg';
import e_Disoriented from './e_Disoriented.jpg';
import e_EcstacyHilarious from './e_EcstacyHilarious.jpg';
import e_EcstacyStarryEyed from './e_EcstacyStarryEyed.jpg';
import e_JoyGoofy from './e_JoyGoofy.jpg';
import e_JoyGoofy2 from './e_JoyGoofy2.jpg';
import e_JoyGoofy3 from './e_JoyGoofy3.jpg';
import e_Love from './e_Love.jpg';
import e_Rage from './e_Rage.jpg';
import e_Rage2 from './e_Rage2.jpg';
import e_Rage3 from './e_Rage3.jpg';
import e_Rage4 from './e_Rage4.jpg';
import e_RemorseShame from './e_RemorseShame.jpg';
import e_Sadness from "./e_Sadness.jpg";
import e_Sleepy from "./e_Sleepy.jpg";
import e_Sleepy2 from "./e_Sleepy2.jpg";
import e_Sleepy3 from "./e_Sleepy3.jpg";
import e_Sleepy4 from "./e_Sleepy4.jpg";
import e_Surprise from "./e_Surprise.jpg";
import e_SystemBlinkLarge from "./e_SystemBlinkLarge.jpg";
import e_SystemBlinkStandard from "./e_SystemBlinkStandard.jpg";
import e_SystemCamera from "./e_SystemCamera.jpg";
import e_Terror from "./e_Terror.jpg";
import e_Terror2 from "./e_Terror2.jpg";
import e_TerrorLeft from "./e_TerrorLeft.jpg";
import e_TerrorRight from "./e_TerrorRight.jpg";
import eyes_acceptance from "./eyes_acceptance.jpg";
import eyes_admiration from "./eyes_admiration.jpg";
import eyes_amazement from "./eyes_amazement.jpg";
import eyes_anger from "./eyes_anger.jpg";
import eyes_annoyed from "./eyes_annoyed.jpg";
import eyes_anticipation from "./eyes_anticipation.png";
import eyes_apprehension from "./eyes_apprehension.jpg";
import eyes_apprehension_1 from "./eyes_apprehension_1.jpg";
import eyes_boredom from "./eyes_boredom.jpg";
import eyes_default from "./eyes_default.jpg";
import eyes_disgust from "./eyes_disgust.jpg";
import eyes_distraction from "./eyes_distraction.gif";
import eyes_ecstasy_frame_1 from "./eyes_ecstasy_frame_1.jpg";
import eyes_ecstasy_frame_2 from "./eyes_ecstasy_frame_2.jpg";
import eyes_fear from "./eyes_fear.jpg";
import eyes_grief from "./eyes_grief.jpg";
import eyes_interest from "./eyes_interest.jpg";
import eyes_joy from "./eyes_joy.jpg";
import eyes_loathing from "./eyes_loathing.jpg";
import eyes_pensiveness from "./eyes_pensiveness.jpg";
import eyes_rage from "./eyes_rage.jpg";
import eyes_sad from "./eyes_sad.jpg";
import eyes_serenity from "./eyes_serenity.jpg";
import eyes_surprise from "./eyes_surprise.png";
import eyes_terror from "./eyes_terror.jpg";
import eyes_trust from "./eyes_trust.jpg";
import eyes_vigilance from "./eyes_vigilance.jpg";

const FaceMap = {
    "e_Sleeping.jpg": e_Sleeping,
    "e_SleepingZZZ.jpg": e_SleepingZZZ,
    "e_Contempt.jpg": e_Contempt,
    "e_ContentLeft.jpg": e_ContentLeft,
    "e_ContentRight.jpg": e_ContentRight,
    "e_Disoriented.jpg": e_Disoriented,
    "e_EcstacyHilarious.jpg": e_EcstacyHilarious,
    "e_EcstacyStarryEyed.jpg": e_EcstacyStarryEyed,
    "e_JoyGoofy.jpg": e_JoyGoofy,
    "e_JoyGoofy2.jpg": e_JoyGoofy2,
    "e_JoyGoofy3.jpg": e_JoyGoofy3,
    "e_Love.jpg": e_Love,
    "e_Rage.jpg": e_Rage,
    "e_Rage2.jpg": e_Rage2,
    "e_Rage3.jpg": e_Rage3,
    "e_Rage4.jpg": e_Rage4,
    "e_RemorseShame.jpg": e_RemorseShame,
    "e_Sadness.jpg": e_Sadness,
    "e_Sleepy.jpg": e_Sleepy,
    "e_Sleepy2.jpg": e_Sleepy2,
    "e_Sleepy3.jpg": e_Sleepy3,
    "e_Sleepy4.jpg": e_Sleepy4,
    "e_Surprise.jpg": e_Surprise,
    "e_SystemBlinkLarge.jpg": e_SystemBlinkLarge,
    "e_SystemBlinkStandard.jpg": e_SystemBlinkStandard,
    "e_SystemCamera.jpg": e_SystemCamera,
    "e_Terror.jpg": e_Terror,
    "e_Terror2.jpg": e_Terror2,
    "e_TerrorLeft.jpg": e_TerrorLeft,
    "e_TerrorRight.jpg": e_TerrorRight,
    "eyes_acceptance.jpg": eyes_acceptance,
    "eyes_admiration.jpg": eyes_admiration,
    "eyes_amazement.jpg": eyes_amazement,
    "eyes_anger.jpg": eyes_anger,
    "eyes_annoyed.jpg": eyes_annoyed,
    "eyes_anticipation.png": eyes_anticipation,
    "eyes_apprehension.jpg": eyes_apprehension,
    "eyes_apprehension_1.jpg": eyes_apprehension_1,
    "eyes_boredom.jpg": eyes_boredom,
    "eyes_default.jpg": eyes_default,
    "eyes_disgust.jpg": eyes_disgust,
    "eyes_distraction.gif": eyes_distraction,
    "eyes_ecstasy_frame_1.jpg": eyes_ecstasy_frame_1,
    "eyes_ecstasy_frame_2.jpg": eyes_ecstasy_frame_2,
    "eyes_fear.jpg": eyes_fear,
    "eyes_grief.jpg": eyes_grief,
    "eyes_interest.jpg": eyes_interest,
    "eyes_joy.jpg": eyes_joy,
    "eyes_loathing.jpg": eyes_loathing,
    "eyes_pensiveness.jpg": eyes_pensiveness,
    "eyes_rage.jpg": eyes_rage,
    "eyes_sad.jpg": eyes_sad,
    "eyes_serenity.jpg": eyes_serenity,
    "eyes_surprise.png": eyes_surprise,
    "eyes_terror.jpg": eyes_terror,
    "eyes_trust.jpg": eyes_trust,
    "eyes_vigilance.jpg": eyes_vigilance,
    };
    
    const FaceLookup = (path) => FaceMap[path];
    export { FaceMap, FaceLookup };