const defaultToolbox =
`<xml id="aot-toolbox" style="display: none">
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
  </xml>`;

export default defaultToolbox;
