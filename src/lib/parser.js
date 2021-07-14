import parser from 'fast-xml-parser';

const options = {
  attributeNamePrefix : "@",
  ignoreAttributes : false,
  ignoreNameSpace: false,
};

class BlockParser {
  constructor() {}

  parseFromString(xmlString) {
    let xmlObj = parser.parse(xmlString,options).xml;
    return this.getAllStacks(xmlObj);
  }

  getAllStacks(xmlObj) {
    if (xmlObj.block) {
      if (Array.isArray(xmlObj.block)) {
        let out = []
        xmlObj.block.forEach(block => {
          out.push(this.getStack(block))
        })
        return out;
      } else {
        return this.getStack(xmlObj.block);
      }
    }
  }

  getStack(block) {
    let currentBlock = block;
    let out = [currentBlock['@type']];

    while(Boolean(currentBlock.next) || Boolean(currentBlock.statement)) {
      if (currentBlock.statement) {
        if (currentBlock.statement.block) {
          out.push(this.getStack(currentBlock.statement.block))
        }
      }
      if (currentBlock.next) {
        currentBlock = currentBlock.next.block;
        out.push(currentBlock['@type']); 
      } else {
        break;
      }
    }
    return out;
  }
}

export default new BlockParser();