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
        'name': 'Logic',
        'categorystyle': 'logic_category',
        'contents': [
          {
            'kind': 'block',
            'type': 'controls_if',
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
        'name': 'Loops',
        'categorystyle': 'loop_category',
        'contents': [
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
            'type': 'Test',
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
        'kind': 'category',
        'name': 'Text',
        'categorystyle': 'text_category',
        'contents': [
          {
            'kind': 'block',
            'type': 'text',
          }
        ],
      },
      {
        'kind': 'category',
        'name': 'Color',
        'categorystyle': 'colour_category',
        'contents': [
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
        ],
      },
      {
        'kind': 'sep',
      },
      {
        'kind': 'category',
        'name': 'Variables',
        'categorystyle': 'variable_category',
        'custom': 'VARIABLE',
      },
      {
        'kind': 'category',
        'name': 'Functions',
        'categorystyle': 'procedure_category',
        'custom': 'PROCEDURE',
      },
      {
        'kind': 'category',
        'name': 'Misty', //replace Lists with Misty
        'categorystyle': 'list_category',
        'contents': [
          {
            "kind": "category",
            "name": "Movement",
            'categorystyle': 'list_category',
            "contents": [
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
              
            ]
          },
          {
            "kind": "category",
            "name": "Speech",
            'categorystyle': 'list_category',
            "contents": [
              {
                'kind': 'block',
                'type': 'Speak',
              },
            ]
          },
          
          
          {
            'kind': 'block',
            'type': 'TurnOnFlashlight',
          },
          {
            'kind': 'block',
            'type': 'TurnOffFlashlight',
          },
          {
            'kind': 'block',
            'type': 'PlayAudio',
          },
          {
            'kind': 'block',
            'type': 'DisplayText',
          },
          {
            'kind': 'block',
            'type': 'ChangeLED',
          },
          {
            'kind': 'block',
            'type': 'DisplayImage',
          },
          
          
          
        ],
      },
    ],
  };
  