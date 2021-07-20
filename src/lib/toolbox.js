const blockTypeToXML = {
  knit_knitstitches : `<block type="knit_knitstitches">
      <value name="VALUE">
        <shadow type="math_positive_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
    </block>`,
  knit_knituntilendofrow : `<block type="knit_knituntilendofrow" />`,
  knit_changecolorto : `<block type="knit_changecolorto">
      <value name="COLOR">
        <shadow type="colour_picker">
          <field name="COLOUR">#b6c3f5</field>
        </shadow>
      </value>
    </block>`,
  knit_castonstitches : `<block type="knit_castonstitches">
      <value name="VALUE">
        <shadow type="math_positive_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
    </block>`,
  knit_castoffstitches : `<block type="knit_castoffstitches" />`,

  control_repeat : `<block id="control_repeat" type="control_repeat">
      <value name="TIMES">
        <shadow type="math_whole_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>`,
  control_repeat_until : `<block type="control_repeat_until" id="control_repeat_until" />`,
  control_forever : `<block id="control_forever" type="control_forever" />`,
  control_if : `<block type="control_if" id="control_if" />`,
  control_if_else : `<block type="control_if_else" id="control_if_else" />`,
  control_stop : `<block id="control_stop" type="control_stop" />`,

  operator_add : `<block type="operator_add" id="operator_add">
      <value name="NUM1">
        <shadow type="math_number">
          <field name="NUM"></field>
        </shadow>
      </value>
      <value name="NUM2">
        <shadow type="math_number">
          <field name="NUM"></field>
        </shadow>
      </value>
    </block>`,
  operator_subtract : `<block type="operator_subtract" id="operator_subtract">
      <value name="NUM1">
        <shadow type="math_number">
          <field name="NUM"></field>
        </shadow>
      </value>
      <value name="NUM2">
        <shadow type="math_number">
          <field name="NUM"></field>
        </shadow>
      </value>
    </block>`,
  operator_multiply : `<block type="operator_multiply" id="operator_multiply">
      <value name="NUM1">
        <shadow type="math_number">
          <field name="NUM"></field>
        </shadow>
      </value>
      <value name="NUM2">
        <shadow type="math_number">
          <field name="NUM"></field>
        </shadow>
      </value>
    </block>`,
  operator_divide : `<block type="operator_divide" id="operator_divide">
      <value name="NUM1">
        <shadow type="math_number">
          <field name="NUM"></field>
        </shadow>
      </value>
      <value name="NUM2">
        <shadow type="math_number">
          <field name="NUM"></field>
        </shadow>
      </value>
    </block>`,
  operator_mod : `<block type="operator_mod" id="operator_mod">
      <value name="NUM1">
        <shadow type="math_number">
          <field name="NUM"></field>
        </shadow>
      </value>
      <value name="NUM2">
        <shadow type="math_number">
          <field name="NUM"></field>
        </shadow>
      </value>
    </block>`,
  operator_random : `<block type="operator_random" id="operator_random">
      <value name="FROM">
        <shadow type="math_number">
          <field name="NUM">1</field>
        </shadow>
      </value>
      <value name="TO">
        <shadow type="math_number">
          <field name="NUM">10</field>
        </shadow>
      </value>
    </block>`,
  operator_round : `<block type="operator_round" id="operator_round">
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM"></field>
        </shadow>
      </value>
    </block>`,
  operator_mathop : `<block type="operator_mathop" id="operator_mathop">
      <value name="NUM">
        <shadow type="math_number">
          <field name="NUM"></field>
        </shadow>
      </value>
    </block>`,
  operator_lt : `<block type="operator_lt" id="operator_lt">
      <value name="OPERAND1">
        <shadow type="text">
          <field name="TEXT"></field>
        </shadow>
      </value>
      <value name="OPERAND2">
        <shadow type="text">
          <field name="TEXT"></field>
        </shadow>
      </value>
    </block>`,
  operator_equals : `<block type="operator_equals" id="operator_equals">
      <value name="OPERAND1">
        <shadow type="text">
          <field name="TEXT"></field>
        </shadow>
      </value>
      <value name="OPERAND2">
        <shadow type="text">
          <field name="TEXT"></field>
        </shadow>
      </value>
    </block>`,
  operator_gt : `<block type="operator_gt" id="operator_gt">
      <value name="OPERAND1">
        <shadow type="text">
          <field name="TEXT"></field>
        </shadow>
      </value>
      <value name="OPERAND2">
        <shadow type="text">
          <field name="TEXT"></field>
        </shadow>
      </value>
    </block>`,
  operator_and : `<block type="operator_and" id="operator_and" />`,
  operator_or : `<block type="operator_or" id="operator_or" />`,
  operator_not : `<block type="operator_not" id="operator_not" />`,

  event_whenbroadcastreceived : `<block type="event_whenbroadcastreceived" id="event_whenbroadcastreceived" />`,
  event_broadcastandwait : `<block type="event_broadcastandwait" id="event_broadcastandwait">
      <value name="BROADCAST_INPUT">
        <shadow type="event_broadcast_menu"></shadow>
      </value>
    </block>`  
};

const getBlock = (type) => blockTypeToXML[type];

const getToolBox = (suggestions = []) => (
`<xml id="aot-toolbox" style="display: none">
  <category name="Knitting" id="knit" colour="#ffffff" secondaryColour="#8ca1ef">
    ${getBlock("knit_knitstitches")}
    ${getBlock("knit_knituntilendofrow")}
    ${getBlock("knit_changecolorto")}
    ${getBlock("knit_castonstitches")}
    ${getBlock("knit_castoffstitches")}
  </category>

  <category name="Logic" id="control" colour="#85E0DF" secondaryColour="#70BAB9">
    ${getBlock("control_repeat")}
    ${getBlock("control_repeat_until")}
    ${getBlock("control_forever")}
    ${getBlock("control_if")}
    ${getBlock("control_if_else")}
    ${getBlock("control_stop")}
  </category>

  <category name="Math" id="operators" colour="#ccfccb" secondaryColour="#8df88b">
    ${getBlock("operator_add")} ${getBlock("operator_subtract")}
    ${getBlock("operator_multiply")} ${getBlock("operator_divide")}
    ${getBlock("operator_mod")} 
    ${getBlock("operator_random")}
    ${getBlock("operator_round")}
    ${getBlock("operator_mathop")}
    ${getBlock("operator_lt")} ${getBlock("operator_equals")} ${getBlock("operator_gt")}
    ${getBlock("operator_and")} ${getBlock("operator_or")} ${getBlock("operator_not")}
  </category>

  <category name="%{BKY_CATEGORY_VARIABLES}" id="data" colour="#8be4ac" secondaryColour="#6adc94" custom="VARIABLE"></category>

  <category name="Functions" id="events" colour="#F7B05B" secondaryColour="#F6A23C">
    ${getBlock("event_whenbroadcastreceived")}
    ${getBlock("event_broadcastandwait")}
  </category>

  <category
    name="%{BKY_CATEGORY_MYBLOCKS}"
    id="myBlocks"
    colour="#FF6680"
    secondaryColour="#FF4D6A"
    custom="PROCEDURE">
  </category>
  
  <category
    name="Suggested Blocks"
    id="suggestedBlocks"
    colour="#905F95"
    secondaryColour="#845889">
    ${
      suggestions.map( type => (
        getBlock(type)
      ))
    }
  </category>
  </xml>`);

const defaultToolBox = getToolBox();

export { 
  defaultToolBox as default,
  getToolBox
}