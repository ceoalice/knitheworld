function RGBToHex(r,g,b) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length === 1) r = "0" + r;
  if (g.length === 1) g = "0" + g;
  if (b.length === 1) b = "0" + b;

  return "#" + r + g + b;
}

/**
 * @param {[[String,Number], String]} blocks - Array that contains block types
 */
function blocksToXML(blocks) {
  return `<xml xmlns="http://www.w3.org/1999/xhtml">
		<variables></variables>
		<block type="event_whenstarted" deletable="false" x="25" y="50">
			<next>
				${recursiveXMLWrite(blocks)}
			</next>
		</block>
    <block type="procedures_definition" x="350" y="35">
      <statement name="custom_block">
        <shadow type="procedures_prototype">
          <mutation proccode="color stitches %s %c" argumentids="[&quot;arg1&quot;,&quot;arg2&quot;]" argumentnames="[&quot;num&quot;,&quot;color&quot;]" argumentdefaults="[&quot;&quot;,&quot;#b6c3f5&quot;]" warp="false"></mutation>
          <value name="arg1">
            <shadow type="argument_reporter_string_number">
              <field name="VALUE">num</field>
            </shadow>
          </value>
          <value name="arg2">
            <shadow type="argument_reporter_colour_picker">
              <field name="VALUE">color</field>
            </shadow>
          </value>
        </shadow>
      </statement>
      <next>
        <block type="knit_changecolorto">
          <value name="COLOR">
            <shadow type="colour_picker" >
              <field name="COLOUR">#b6c3f5</field>
            </shadow>
            <block type="argument_reporter_colour_picker">
              <field name="VALUE">color</field>
            </block>
          </value>
          <next>
            <block type="knit_knitstitches">
              <value name="VALUE">
                <shadow type="math_positive_number">
                  <field name="NUM">1</field>
                </shadow>
                <block type="argument_reporter_string_number">
                  <field name="VALUE">num</field>
                </block>
              </value>
            </block>
          </next>
        </block>
      </next>
    </block>
	</xml>`
}

function recursiveXMLWrite(blocks, i=0, lastColor=null) {
  if (i === blocks.length) return "";
  let block =  blocks[i];
  switch(block) {
    case "END_ROW": // knit until row ends
    return `<block type="knit_knituntilendofrow">
              <next>
                ${recursiveXMLWrite(blocks, i+1, lastColor)}
              </next>
            </block>`
    default:  // set color to block[0] and stick the next block[1] stiches
      return `<block type="procedures_call">
                <mutation proccode="color stitches %s %c" argumentids="[&quot;arg1&quot;,&quot;arg2&quot;]" warp="false"></mutation>
                <value name="arg1">
                  <shadow type="text">
                    <field name="TEXT">${block[1]}</field>
                  </shadow>
                </value>
                <value name="arg2">
                  <shadow type="colour_picker">
                    <field name="COLOUR">${block[0]}</field>
                  </shadow>
                </value>
                <next>
                  ${recursiveXMLWrite(blocks, i+1, block[0])}
                </next>
              </block>`;
  }
}

module.exports = {
  RGBToHex,
  blocksToXML
}