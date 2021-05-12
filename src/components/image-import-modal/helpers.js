function RGBToHex(r,g,b) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length === 1)
    r = "0" + r;
  if (g.length === 1)
    g = "0" + g;
  if (b.length === 1)
    b = "0" + b;

  return "#" + r + g + b;
}

/**
 * @param {[[String,Number], String]} blocks - Array that contains block types
 */
function blocksToXML(blocks) {
  return `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="event_whenstarted" deletable="false" x="90" y="206">
      <next>
        ${recursiveXMLWrite(0,blocks)}
      </next>
    </block>
    </xml>`
}

function recursiveXMLWrite(i, blocks) {
  if (i === blocks.length) return "";
  let block =  blocks[i];
  switch(block) {
    case "END_ROW": // set color to #FFF and knit until row ends
    return `<block type="knit_knituntilendofrow">
      <next>
        ${recursiveXMLWrite(i+1, blocks)}
      </next>
    </block>`
    default:  // set color to block[0] and stick the next block[1] stiches
      return `<block type="knit_changecolorto">
        <value name="COLOR">
          <shadow type="colour_picker">
            <field name="COLOUR">${block[0]}</field>
          </shadow>
        </value>
        <next>
          <block type="knit_knitstitches">
            <value name="VALUE">
              <shadow type="math_positive_number">
                <field name="NUM">${block[1]}</field>
              </shadow>
            </value>
            <next>
              ${recursiveXMLWrite(i+1, blocks)}
            </next>
          </block>
        </next>
      </block>`
  }
}

module.exports = {
  RGBToHex,
  blocksToXML
}