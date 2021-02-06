/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Massachusetts Institute of Technology
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

goog.provide('Blockly.Blocks.microworld');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');

Blockly.Blocks['event_whenstarted'] = {
  init: function() {
    this.jsonInit({
      "message0": "when knitting %1",
        "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "started.svg",
          "width": 40,
          "height": 40,
          "alt": "play button"
        }
      ],
      "category": Blockly.Categories.event,
      "extensions": ["colours_event", "shape_hat"]
    });
  }
};

Blockly.Blocks['looks_forwardpixel'] = {
  init: function() {
    this.jsonInit({
      "message0": "forward %1",
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "category": Blockly.Categories.looks,
      "extensions": ["colours_looks", "shape_statement"]
    });
  }
};

Blockly.Blocks['looks_backpixel'] = {
  init: function() {
    this.jsonInit({
      "message0": "back %1",
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "category": Blockly.Categories.looks,
      "extensions": ["colours_looks", "shape_statement"]
    });
  }
};

Blockly.Blocks['looks_nextpixel'] = {
  init: function() {
    this.jsonInit({
      "message0": "next pixel",
      "category": Blockly.Categories.looks,
      "extensions": ["colours_looks", "shape_statement"]
    });
  }
};

Blockly.Blocks['looks_previouspixel'] = {
  init: function() {
    this.jsonInit({
      "message0": "previous pixel",
      "category": Blockly.Categories.looks,
      "extensions": ["colours_looks", "shape_statement"]
    });
  }
};

Blockly.Blocks['looks_changecolor'] = {
  init: function() {
    this.jsonInit({
      "message0": "change color by %1",
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "category": Blockly.Categories.looks,
      "extensions": ["colours_looks", "shape_statement"]
    });
  }
};

Blockly.Blocks['looks_setcolor'] = {
  init: function() {
    this.jsonInit({
      "message0": "set color to %1",
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "category": Blockly.Categories.looks,
      "extensions": ["colours_looks", "shape_statement"]
    });
  }
};

Blockly.Blocks['control_waitms'] = {
  init: function() {
    this.jsonInit({
      "message0": "wait %1 milliseconds",
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "category": Blockly.Categories.control,
      "extensions": ["colours_control", "shape_statement"]
    });
  }
};

Blockly.Blocks['looks_setallcolors'] = {
  init: function() {
    this.jsonInit({
      "message0": "set all pixels to color %1",
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "category": Blockly.Categories.looks,
      "extensions": ["colours_looks", "shape_statement"]
    });
  }
};

Blockly.Blocks['knit_knitstitches'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 knit %3 stitches",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "extensions/knit-block-icon.svg",
          "width": 40,
          "height": 40
        },
        {
          "type": "field_vertical_separator"
        },
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "category": Blockly.Categories.knit,
      "extensions": ["colours_knit", "shape_statement"]
    });
  }
};

Blockly.Blocks['knit_knituntilendofrow'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 knit until end of row",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "extensions/knit-block-icon.svg",
          "width": 40,
          "height": 40
        },
        {
          "type": "field_vertical_separator"
        }
      ],
      "category": Blockly.Categories.knit,
      "extensions": ["colours_knit", "shape_statement"]
    });
  }
};

Blockly.Blocks['knit_castonstitches'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 cast on %3 rows",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "extensions/knit-block-icon.svg",
          "width": 40,
          "height": 40
        },
        {
          "type": "field_vertical_separator"
        },
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "category": Blockly.Categories.knit,
      "extensions": ["colours_knit", "shape_statement"]
    });
  }
};

Blockly.Blocks['knit_castoffstitches'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 bind off",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "extensions/knit-block-icon.svg",
          "width": 40,
          "height": 40
        },
        {
          "type": "field_vertical_separator"
        }
      ],
      "category": Blockly.Categories.knit,
      "extensions": ["colours_knit", "shape_end"]
    });
  }
};

Blockly.Blocks['knit_changecolorto'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 change color to %3",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "extensions/knit-block-icon.svg",
          "width": 40,
          "height": 40
        },
        {
          "type": "field_vertical_separator"
        },
        {
          "type": "input_value",
          "name": "COLOR"
        }
      ],
      "category": Blockly.Categories.knit,
      "extensions": ["colours_knit", "shape_statement"]
    });
  }
};

// UNIMPLEMENTED KNIT BLOCKS

Blockly.Blocks['knit_nextrow'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 move to next row",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "extensions/knit-block-icon.svg",
          "width": 40,
          "height": 40
        },
        {
          "type": "field_vertical_separator"
        }
      ],
      "category": Blockly.Categories.knit,
      "extensions": ["colours_knit", "shape_statement"]
    });
  }
};

Blockly.Blocks['knit_purlstitches'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 purl stitches %3",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "extensions/knit-block-icon.svg",
          "width": 40,
          "height": 40
        },
        {
          "type": "field_vertical_separator"
        },
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "category": Blockly.Categories.knit,
      "extensions": ["colours_knit", "shape_statement"]
    });
  }
};

Blockly.Blocks['knit_untilendofrow'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 until end of row",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "extensions/knit-block-icon.svg",
          "width": 40,
          "height": 40
        },
        {
          "type": "field_vertical_separator"
        }
      ],
      "category": Blockly.Categories.knit,
      "extensions": ["colours_knit", "output_number"]
    });
  }
};

Blockly.Blocks['knit_removerow'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 remove row",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "extensions/knit-block-icon.svg",
          "width": 40,
          "height": 40
        },
        {
          "type": "field_vertical_separator"
        }
      ],
      "category": Blockly.Categories.knit,
      "extensions": ["colours_control", "shape_statement"]
    });
  }
};

Blockly.Blocks['knit_hsbcolor'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 HSB color %3 %4 %5",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "extensions/knit-block-icon.svg",
          "width": 40,
          "height": 40
        },
        {
          "type": "field_vertical_separator"
        },
        {
          "type": "input_value",
          "name": "HUE"
        },
        {
          "type": "input_value",
          "name": "SATURATION"
        },
        {
          "type": "input_value",
          "name": "BRIGHTNESS"
        }
      ],
      "category": Blockly.Categories.knit,
      "extensions": ["colours_knit", "output_number"]
    });
  }
};

Blockly.Blocks['knit_purluntilendofrow'] = {
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 purl until end of row",
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "extensions/knit-block-icon.svg",
          "width": 40,
          "height": 40
        },
        {
          "type": "field_vertical_separator"
        }
      ],
      "category": Blockly.Categories.knit,
      "extensions": ["colours_knit", "shape_statement"]
    });
  }
};
