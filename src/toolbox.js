/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/

export const toolbox = {
    'kind': 'categoryToolbox',
    'contents': [
      {
        'kind': 'category',
        'name': 'Functions',
        'categorystyle': 'procedure_category',
        'custom': 'PROCEDURE',
      },
      {
        "kind": "category",
        "name": "Triggers",
        'categorystyle': 'trigger_category',
        "contents": [
          {
            'kind': 'block',
            'type': 'FrontLeftBumperPress',
          },
          {
            'kind': 'block',
            'type': 'FrontRightBumperPress',
          },
          {
            'kind': 'block',
            'type': 'RearLeftBumperPress',
          },
          {
            'kind': 'block',
            'type': 'RearRightBumperPress',
          },
        ]
      },
      {
        'kind': 'category',
        'name': 'Control',
        'categorystyle': 'logic_category',
        'contents': [
          {
            'kind': 'block',
            'type': 'controls_if',
          },
          {
            'kind': 'block',
            'type': 'controls_repeat_ext',
            'inputs': {
              'TIMES': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 10,
                  },
                },
              },
            },
          },
          {
            'kind': 'block',
            'type': 'logic_compare',
          },
          {
            'kind': 'block',
            'type': 'logic_operation',
          },
          {
            'kind': 'block',
            'type': 'logic_negate',
          },
          {
            'kind': 'block',
            'type': 'logic_boolean',
          },
          {
            'kind': 'block',
            'type': 'logic_null',
          },
          {
            'kind': 'block',
            'type': 'logic_ternary',
          },
          
        ],
      },
      {
        'kind': 'category',
        'name': 'Math',
        'categorystyle': 'math_category',
        'contents': [
          {
            'kind': 'block',
            'type': 'math_number',
            'fields': {
              'NUM': 123,
            },
          },
          {
            'kind': 'block',
            'type': 'BasicSlider'
          },
          {
            'kind': 'block',
            'type': 'math_number_property',
            'inputs': {
              'NUMBER_TO_CHECK': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 0,
                  },
                },
              },
            },
          },
        
          
          {
            'kind': 'block',
            'type': 'math_random_int',
            'inputs': {
              'FROM': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 1,
                  },
                },
              },
              'TO': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 100,
                  },
                },
              },
            },
          },
        
          
        ],
      },
      {
        "kind": "category",
        "name": "Movement",
        'categorystyle': 'movement_category',
        "contents": [
          {
            'kind': 'block',
            'type': 'WaitForSeconds',
          },
          {
            'kind': 'block',
            'type': 'DriveTime',
          },
          {
            'kind': 'block',
            'type': 'DriveTime2',
          },
          {
            'kind': 'block',
            'type': 'Turn', 
          },   
          {
            'kind': 'block',
            'type': 'Turn2',
          },
          {
            'kind': 'block',
            'type': 'MoveHead',
          },
          {
            'kind': 'block',
            'type': 'MoveHead3',
          },
          {
            'kind': 'block',
            'type': 'MoveArm',
          },
          {
            'kind': 'block',
            'type': 'MoveArm2',
          },
          {
            'kind': 'block',
            'type': 'MoveArms2',
          },
          {
            'kind': 'block',
            'type': 'MoveArm3',
          },
        ]
      },
      {
        "kind": "category",
        "name": "Light",
        'categorystyle': 'light_category',
        "contents": [
          {
            'kind': 'block',
            'type': 'ChangeLED',
          },
          {
            'kind': 'block',
            'type': 'TransitionLED',
          },
          {
            'kind': 'block',
            'type': 'colour_picker',
          },
          {
            'kind': 'block',
            'type': 'colour_random',
          },
          {
            'kind': 'block',
            'type': 'colour_rgb',
            'inputs': {
              'RED': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 100,
                  },
                },
              },
              'GREEN': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 50,
                  },
                },
              },
              'BLUE': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 0,
                  },
                },
              },
            },
          },
          {
            'kind': 'block',
            'type': 'colour_blend',
            'inputs': {
              'COLOUR1': {
                'shadow': {
                  'type': 'colour_picker',
                  'fields': {
                    'COLOUR': '#ff0000',
                  },
                },
              },
              'COLOUR2': {
                'shadow': {
                  'type': 'colour_picker',
                  'fields': {
                    'COLOUR': '#3333ff',
                  },
                },
              },
              'RATIO': {
                'shadow': {
                  'type': 'math_number',
                  'fields': {
                    'NUM': 0.5,
                  },
                },
              },
            },
          },
          {
            'kind': 'block',
            'type': 'TurnOnFlashlight',
          },
          {
            'kind': 'block',
            'type': 'TurnOffFlashlight',
          },
        ]
      },
      {
        "kind": "category",
        "name": "Speech",
        'categorystyle': 'speech_category',
        "contents": [
          {
            'kind': 'block',
            'type': 'Speak',
          },
          {
            'kind': 'block',
            'type': 'SpeakDefault',
          },
          {
            'kind': 'block',
            'type': 'text',
          }
        ]
      },
      {
        "kind": "category",
        "name": "Face",
        'categorystyle': 'face_category',
        "contents": [
          {
            'kind': 'block',
            'type': 'DisplayText',
          },
          {
            'kind': 'block',
            'type': 'ClearText',
          },
          {
            'kind': 'block',
            'type': 'DisplayImage',
          },
          {
            'kind': 'block',
            'type': 'eyes_acceptance',
          },
          {
            'kind': 'block',
            'type': 'eyes_admiration',
          },
          {
            'kind': 'block',
            'type': 'eyes_amazement',
          },
          {
            'kind': 'block',
            'type': 'eyes_anger',
          },
          {
            'kind': 'block',
            'type': 'eyes_annoyed',
          },
          {
            'kind': 'block',
            'type': 'eyes_anticipation',
          },
          {
            'kind': 'block',
            'type': 'eyes_apprehension',
          },
          {
            'kind': 'block',
            'type': 'eyes_boredom',
          },
          {
            'kind': 'block',
            'type': 'eyes_default',
          },
          {
            'kind': 'block',
            'type': 'eyes_disgust',
          },
          {
            'kind': 'block',
            'type': 'eyes_distraction',
          },
          {
            'kind': 'block',
            'type': 'eyes_ecstasy_frame_1',
          },
          {
            'kind': 'block',
            'type': 'eyes_ecstasy_frame_2',
          },
          {
            'kind': 'block',
            'type': 'eyes_fear',
          },
          {
            'kind': 'block',
            'type': 'eyes_grief',
          },
          {
            'kind': 'block',
            'type': 'eyes_interest',
          },
          {
            'kind': 'block',
            'type': 'eyes_joy',
          },
          {
            'kind': 'block',
            'type': 'eyes_loathing',
          },
          {
            'kind': 'block',
            'type': 'eyes_pensiveness',
          },
          {
            'kind': 'block',
            'type': 'eyes_rage',
          },
          {
            'kind': 'block',
            'type': 'eyes_sad',
          },
          {
            'kind': 'block',
            'type': 'eyes_serenity',
          },
          {
            'kind': 'block',
            'type': 'eyes_surprise',
          },
          {
            'kind': 'block',
            'type': 'eyes_terror',
          },
          {
            'kind': 'block',
            'type': 'eyes_trust',
          },
          {
            'kind': 'block',
            'type': 'eyes_vigilance',
          },
          {
            'kind': 'block',
            'type': 'e_Sleeping',
          },
          {
            'kind': 'block',
            'type': 'e_SleepingZZZ',
          },
          {
            'kind': 'block',
            'type': 'e_Contempt',
          },
          {
            'kind': 'block',
            'type': 'e_ContentLeft',
          },
          {
            'kind': 'block',
            'type': 'e_ContentRight',
          },
          {
            'kind': 'block',
            'type': 'e_Disoriented',
          },
          {
            'kind': 'block',
            'type': 'e_EcstacyHilarious',
          },
          {
            'kind': 'block',
            'type': 'e_EcstacyStarryEyed',
          },
          {
            'kind': 'block',
            'type': 'e_JoyGoofy',
          },
          {
            'kind': 'block',
            'type': 'e_JoyGoofy2',
          },
          {
            'kind': 'block',
            'type': 'e_JoyGoofy3',
          },
          {
            'kind': 'block',
            'type': 'e_Love',
          },
          {
            'kind': 'block',
            'type': 'e_Rage',
          },
          {
            'kind': 'block',
            'type': 'e_Rage2',
          },
          {
            'kind': 'block',
            'type': 'e_Rage3',
          },
          {
            'kind': 'block',
            'type': 'e_Rage4',
          },
          {
            'kind': 'block',
            'type': 'e_RemorseShame',
          }
        ]
      },
      {
        "kind": "category",
        "name": "Audio",
        'categorystyle': 'audio_category',
        "contents": [
          {
            'kind': 'block',
            'type': 'SetVolume',
          },
          {
            'kind': 'block',
            'type': 'PlayAudio',
          },
          {
            'kind': 'block',
            'type': 's_Acceptance',
          },
          {
            'kind': 'block',
            'type': 's_Amazement',
          },
          {
            'kind': 'block',
            'type': 's_Amazement2',
          },
          {
            'kind': 'block',
            'type': 's_Anger',
          },
          {
            'kind': 'block',
            'type': 's_Anger2',
          },
          {
            'kind': 'block',
            'type': 's_Anger3',
          },
          {
            'kind': 'block',
            'type': 's_Anger4',
          },
          {
            'kind': 'block',
            'type': 's_Annoyance',
          },
          {
            'kind': 'block',
            'type': 's_Annoyance2',
          },
          {
            'kind': 'block',
            'type': 's_Annoyance3',
          },
          {
            'kind': 'block',
            'type': 's_Annoyance4',
          },
          {
            'kind': 'block',
            'type': 's_Awe',
          },
          {
            'kind': 'block',
            'type': 's_Awe2',
          },
          {
            'kind': 'block',
            'type': 's_Awe3',
          },
          {
            'kind': 'block',
            'type': 's_Boredom',
          },
          {
            'kind': 'block',
            'type': 's_Disapproval',
          },
          {
            'kind': 'block',
            'type': 's_Disgust',
          },
          {
            'kind': 'block',
            'type': 's_Disgust2',
          },
          {
            'kind': 'block',
            'type': 's_Disgust3',
          },
          {
            'kind': 'block',
            'type': 's_DisorientedConfused',
          },
          {
            'kind': 'block',
            'type': 's_DisorientedConfused2',
          },
          {
            'kind': 'block',
            'type': 's_DisorientedConfused3',
          },
          {
            'kind': 'block',
            'type': 's_DisorientedConfused4',
          },
          {
            'kind': 'block',
            'type': 's_DisorientedConfused5',
          },
          {
            'kind': 'block',
            'type': 's_DisorientedConfused6',
          },
          {
            'kind': 'block',
            'type': 's_Distraction',
          },
          {
            'kind': 'block',
            'type': 's_Ecstacy',
          },
          {
            'kind': 'block',
            'type': 's_Ecstacy2',
          },
          {
            'kind': 'block',
            'type': 's_Fear',
          },
          {
            'kind': 'block',
            'type': 's_Grief',
          },
          {
            'kind': 'block',
            'type': 's_Grief2',
          },
          {
            'kind': 'block',
            'type': 's_Grief3',
          },
          {
            'kind': 'block',
            'type': 's_Grief4',
          },
          {
            'kind': 'block',
            'type': 's_Joy',
          },
          {
            'kind': 'block',
            'type': 's_Joy2',
          },
          {
            'kind': 'block',
            'type': 's_Joy3',
          },
          {
            'kind': 'block',
            'type': 's_Joy4',
          },
          {
            'kind': 'block',
            'type': 's_Loathing',
          },
          {
            'kind': 'block',
            'type': 's_Love',
          },
          {
            'kind': 'block',
            'type': 's_PhraseByeBye',
          },
          {
            'kind': 'block',
            'type': 's_PhraseEvilAhHa',
          },
          {
            'kind': 'block',
            'type': 's_PhraseHello',
          },
          {
            'kind': 'block',
            'type': 's_PhraseNoNoNo',
          },
          {
            'kind': 'block',
            'type': 's_PhraseOopsy',
          },
          {
            'kind': 'block',
            'type': 's_PhraseOwOwOw',
          },
          {
            'kind': 'block',
            'type': 's_PhraseOwwww',
          },
          {
            'kind': 'block',
            'type': 's_PhraseUhOh',
          },
          {
            'kind': 'block',
            'type': 's_Rage',
          },
          {
            'kind': 'block',
            'type': 's_Sadness',
          },
          {
            'kind': 'block',
            'type': 's_Sadness2',
          },
          {
            'kind': 'block',
            'type': 's_Sadness3',
          },
          {
            'kind': 'block',
            'type': 's_Sadness4',
          },
          {
            'kind': 'block',
            'type': 's_Sadness5',
          },
          {
            'kind': 'block',
            'type': 's_Sadness6',
          },
          {
            'kind': 'block',
            'type': 's_Sadness7',
          },
          {
            'kind': 'block',
            'type': 's_Sleepy',
          },
          {
            'kind': 'block',
            'type': 's_Sleepy2',
          },
          {
            'kind': 'block',
            'type': 's_Sleepy3',
          },
          {
            'kind': 'block',
            'type': 's_Sleepy4',
          },
          {
            'kind': 'block',
            'type': 's_SleepySnore',
          },
          {
            'kind': 'block',
            'type': 's_SystemCameraShutter',
          }
        ]
      },
    ],
  };
  