export const RAD_2_DEG = 180 / Math.PI;
export const DEG_2_RAD = Math.PI / 180;
export const PI = Math.PI;
export const MISTY_ARM_LENGTH = 0.079; // in meters
export const MAX_ARM_SPEED = (2 * Math.PI * MISTY_ARM_LENGTH * 180) / 1.5;
export const ARM_OFFSET_ANGLE = 45;
export const MAX_DIST_PER_SEC = 0.3725; // in meters (calculated to be about 14.66666667 inches/s) // this is the max velocity, but this actually works on a curve. So will probs have to update
export const MAX_ANGLE_PER_SEC = 50 * PI/180; // I am estimating on a linear trend, where slope = 50 degrees / sec // this is the max rotation, but an exponential trend seems to work better. So will probs have to update
export const SIM_TIME = 1000;
export const MS_TO_SEC = 1000;

export const SETTINGS_MODAL = "settings"
export const PROMPT_MODAL = "prompt"

export const DAY_ONE_BTN_TEXT = "Planning";
export const DAY_TWO_BTN_TEXT = "Programming";

export const SELECTION_SCREEN = 0;
export const DAY_ONE_SCREEN = 1;
export const DAY_TWO_SCREEN = 2;