import parser from 'fast-xml-parser';

const options = {
  attributeNamePrefix : "@",
  ignoreAttributes : false,
  ignoreNameSpace: false,
};

class BlockParser {
  constructor() {
    this.primary = [];
    this.secondary = [];
  }

// CLASS METHODS ---------------------------------------
  setPrimaryStack(stack) {
    this.primary = stack;
  }

  addSecondaryStack(stack) {
    this.secondary.push(stack);
  }

  // maybe methods? 
  getVariables() {
  }
  getLists() {
  }
  getCustomBlocks() {
  }

// STATIC METHODS -------------------------------------- 
  static parse(xmlString) {
    let out = new BlockParser();

    let xmlObj = parser.parse(xmlString,options).xml;
    let stacks = BlockParser.getAllStacks(xmlObj);
    
    if (stacks[0] == 'event_whenstarted') { // Single Stack
      out.setPrimaryStack(stacks);
    } else { // Multiple Stacks
      // find primary stack and rest are secondary
      stacks.forEach((stack) => {
        if(stack[0] == 'event_whenstarted') {
          out.setPrimaryStack(stack);
        } else {
          out.addSecondaryStack(stack);
        }
      });
    }

    return out;
  }

  static getAllStacks(xmlObj) {
    if (xmlObj.block) {
      if (Array.isArray(xmlObj.block)) {
        let out = []
        xmlObj.block.forEach(block => {
          out.push(BlockParser.getStack(block))
        })
        return out;
      } else {
        return BlockParser.getStack(xmlObj.block);
      }
    }
  }

  static getStack(block) {
    let currentBlock = block;
    let out = [currentBlock['@type']];

    while(Boolean(currentBlock.next) || Boolean(currentBlock.statement)) {
      if (currentBlock.statement) {
        if (currentBlock.statement.block) {
          out.push(BlockParser.getStack(currentBlock.statement.block))
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

export default BlockParser;