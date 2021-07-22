const bp = require("./parser.js");

const parser = new bp.BlockParser();

for (let i = 1; i <= 22; i++) {
  parser.parseAndSaveFile(`index${i}.xml`);
}