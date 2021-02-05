const defaultToolbox =
`<xml id="aot-toolbox" style="display: none">
  <category name="Knitting" id="knit" colour="#FFFFFF" secondaryColour="#93A5DC">
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
    <category name="Control" id="control" colour="#FFAB19" secondaryColour="#EC9C13">
      <block id="control_waitms" type="control_waitms">
        <value name="VALUE">
          <shadow type="math_positive_number">
            <field name="NUM">50</field>
          </shadow>
        </value>
      </block>
      <block id="control_repeat" type="control_repeat">
        <value name="TIMES">
          <shadow type="math_whole_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block id="control_forever" type="control_forever"></block>
      <block id="control_stop" type="control_stop"></block>
      <block id="operator_random" type="operator_random">
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
    </category>
    <category name="My Blocks" id="myBlocks" colour="#FF6680" secondaryColour="#FF4D6A" custom="PROCEDURE"></category>
  </xml>`;

export default defaultToolbox;
