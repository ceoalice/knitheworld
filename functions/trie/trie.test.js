const trie = require("./trie.js");
const fs = require("fs");
const util = require('util');

const allTest = [test1,test2,test3,test4,test5,test6,test7,test8,test9,test10];

// console.log(process.argv);
if (process.argv[2]) {
  console.log(`test${process.argv[2]}`)
  let i = Number(process.argv[2]) - 1;
  if(i < allTest.length) allTest[i]();
} else { // all tests

}

function test1() { // works with strings
  let t = new trie.Trie();
  let words = ["A", "to", "tea", "ted", "ten", "i", "in", "inn"];
  words.forEach(word => {
    t.addIterable(word);
  })
  console.log(util.inspect(t.toObject(), false, null, true /* enable colors */))
}

function test2() { // works with arrays
  let t = new trie.Trie();
  let words = [['A'],['t','o'],['t','e','a'],['t','e','d'],['t','e','n'],['i'],['i','n','n'],['i','n']];
  words.forEach(word => {
    t.addIterable(word);
  });

  t.saveToOutput("test2");
}

function test3() { // test getNext
  let t = new trie.Trie();
  let words = ["A", "to", "tea", "ted", "ten", "i", "in", "inn"];
  words.forEach(word => {
    t.addIterable(word);
  })
  let word = "t"; 
  let suggestions = t.getNext(word);
  console.log(suggestions.map(a => `${word}${a.getValue()}`))
}

function test4() {
  let t = new trie.Trie();
  let words = ["A", "to", "tea", "ted", "ten", "i", "in", "inn"];
  words.forEach(word => {
    t.addIterable(word);
  })
  let word = "te"; 
  let suggestions = t.getNext(word);
  console.log(suggestions.map(a => `${word}${a.getValue()}`))
}

function test5() {
  let t = new trie.Trie();

  let data = fs.readFileSync("./input/1000_words.txt",'utf-8');

  let words = data.split('\n');
  words.forEach(word => {
    t.addIterable(word);
  });

  t.saveToOutput("1000_words");
}

function test6() { // test getNext()
  let t = new trie.Trie();
  let data = fs.readFileSync("./input/1000_words.txt",'utf-8');
  let words = data.split('\n');
  words.forEach(word => {
    t.addIterable(word);
  });
  
  let word = "te";
  let suggestions = t.getNext(word);
  console.log(suggestions.map(a => `${word}${a.getValue()}`))
}

function test7() { // test fromObject()
  let t1 = new trie.Trie();
  let words = [['A'],['t','o'],['t','e','a'],['t','e','d'],['t','e','n'],['i'],['i','n','n'],['i','n']];
  words.forEach(word => {
    t1.addIterable(word);
  });

  let obj = JSON.parse(fs.readFileSync("./input/test7.json",'utf-8'));
  let t2 = trie.Trie.fromObject(obj);
  let isEqual = JSON.stringify(t1.toObject()) === JSON.stringify(t2.toObject());

  console.log(isEqual)
}

function test8() { // test autoComplete()
  let t = new trie.Trie();
  let data = fs.readFileSync("./input/1000_words.txt",'utf-8');
  let words = data.split('\n');
  words.forEach(word => {
    t.addIterable(word);
  });

  let word = "ap";
  let completes = t.autoComplete(word);

  console.log(completes.map(a => `${word}${a}`));
}

function test9() { // with parser outputs
  let t = new trie.Trie();

  for (let i = 1; i<= 22; i++ ) {
    let stacks = JSON.parse(fs.readFileSync(`../parser/output/index${i}.xml.json`,'utf-8'));
    // index20.xml.json is only one stack BUT NOT NESTED NEED CHECK
    // console.log(`../parser/output/index${i}.xml.json`)
    t.addIterable(stacks);
    // stacks.forEach(stack => t.addIterable(stack));
    console.log("")
    console.log("")
    console.log("")
    
  }

  t.saveToOutput("test9");
}

function test10() {
  let obj = JSON.parse(fs.readFileSync("./input/default.json",'utf-8'));
  let t1 = trie.Trie.fromObject(obj);
  let t2 = new trie.Trie();
  for (let i = 1; i<= 22; i++ ) {
    let stacks = JSON.parse(fs.readFileSync(`../parser/output/index${i}.xml.json`,'utf-8'));
    // console.log(stack)
    stacks.forEach(stack => t2.addIterable(stack));
  }

  let isEqual = JSON.stringify(t1.toObject()) === JSON.stringify(t2.toObject());
  console.log(isEqual)
}