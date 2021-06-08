const defaultToolbox =
`<xml id="aot-toolbox" style="display: none">
  <category name="Knitting" id="knit" colour="#ffffff" secondaryColour="#8ca1ef">
      <block type="knit_knitstitches">
        <value name="VALUE">
          <shadow type="math_positive_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="knit_knituntilendofrow" />
      <block type="knit_changecolorto">
        <value name="COLOR">
          <shadow type="colour_picker">
            <field name="COLOUR">#b6c3f5</field>
          </shadow>
        </value>
      </block>
      <block type="knit_castonstitches">
        <value name="VALUE">
          <shadow type="math_positive_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="knit_castoffstitches" />
    </category>
    <category name="Logic" id="control" colour="#85E0DF" secondaryColour="#70BAB9">
      <block id="control_repeat" type="control_repeat">
        <value name="TIMES">
          <shadow type="math_whole_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block type="control_repeat_until" id="control_repeat_until"></block>
      <block id="control_forever" type="control_forever"></block>
      <block type="control_if" id="control_if"></block>
      <block type="control_if_else" id="control_if_else"></block>
      <block id="control_stop" type="control_stop"></block>
    </category>
    <category name="Math" id="operators" colour="#ccfccb" secondaryColour="#8df88b">
      <block type="operator_add" id="operator_add">
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
      </block>
      <block type="operator_subtract" id="operator_subtract">
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
      </block>
      <block type="operator_multiply" id="operator_multiply">
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
      </block>
      <block type="operator_divide" id="operator_divide">
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
      </block>
      <block type="operator_mod" id="operator_mod">
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
      </block>
      <block type="operator_random" id="operator_random">
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
      </block>
      <block type="operator_round" id="operator_round">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM"></field>
          </shadow>
        </value>
      </block>
      <block type="operator_mathop" id="operator_mathop">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM"></field>
          </shadow>
        </value>
      </block>
      <block type="operator_lt" id="operator_lt">
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
      </block>
      <block type="operator_equals" id="operator_equals">
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
      </block>
      <block type="operator_gt" id="operator_gt">
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
      </block>
      <block type="operator_and" id="operator_and"></block>
      <block type="operator_or" id="operator_or"></block>
      <block type="operator_not" id="operator_not"></block>
    </category>
    <category name="%{BKY_CATEGORY_VARIABLES}" id="data" colour="#8be4ac" secondaryColour="#6adc94" custom="VARIABLE"></category>
    <category name="Functions" id="events" colour="#F7B05B" secondaryColour="#F6A23C">
      <block type="event_whenbroadcastreceived" id="event_whenbroadcastreceived"></block>
      <block type="event_broadcastandwait" id="event_broadcastandwait">
        <value name="BROADCAST_INPUT">
          <shadow type="event_broadcast_menu"></shadow>
        </value>
      </block>
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
    </category>
  </xml>`;

export default defaultToolbox;
