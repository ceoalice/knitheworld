const fs = require('fs')

const MAX_TRIE_DEPTH = 30;

/**
 * https://stackoverflow.com/questions/13523951/how-to-check-the-depth-of-an-object
 * @param {object} object 
 * @returns 
 */
function depthOf(object) {
  var level = 1;
  for(var key in object) {
      if (!object.hasOwnProperty(key)) continue;

      if(typeof object[key] == 'object'){
          var depth = depthOf(object[key]) + 1;
          level = Math.max(depth, level);
      }
  }
  return level;
}


class TrieNode {
  constructor(value) {
    this.value = value;
    this.weight = 0;
    this.next = {};
  }
  setWeight(w) {
    this.weight = w;
  }
  setValue(v) {
    this.value = v;
  }
  getValue() {
    return this.value;
  }
  getWeight() {
    return this.weight;
  }
  addWeight() {
    this.weight += 1;
  }
  addNext(node) {
    this.next[node.getValue()] = node;
  }
  hasNext(char) {
    return (char in this.next);
  }
  getNext(char) {
    return this.next[char];
  }
  getAllNext() {
    return Object.keys(this.next);
  }
  getAllWords(outputArray) { // go down tree starting from this node and get all words
    let  out = [];
    for (let char in this.next) {
      let node = this.next[char];
      let words = node.getAllWords(outputArray);
      if (words.length == 0) {
        if (outputArray) out.push([char]);
        else out.push(char);
      } else {
        words.forEach(word => {
          if (outputArray) out.push([char, ...word]);
          else out.push(char + word)
        })
      }
    }
    return out; 
  }
  toObject() {
    let nextObject = {};
    for (let char in this.next) {
      nextObject[char] = this.next[char].toObject()
    }
    return Object.keys(nextObject).length 
    ? {
        value : this.value,
        weight : this.weight,
        next : nextObject
      }
    : {
        value : this.value,
        weight : this.weight
      }
  }
  static fromObject(obj) {
    let out = new TrieNode();

    out.setWeight(obj.weight);
    out.setValue(obj.value);

    if (obj.next) {
      for (let prop in obj.next) {
        let nextNode = TrieNode.fromObject(obj.next[prop]);
        out.addNext(nextNode);
      }
    }
    return out; 
  }
}


class Trie {
  constructor() {
    this.root = new TrieNode(null);
    this.allNodes = [this.root];
  }


  /** INFINITEE LOOP SOMETIMES? */
  setAllNodes() {
    for (let i = 0; i < this.allNodes.length; i++) {
      let prevNode = this.allNodes[i];
      Object.values(prevNode.next).forEach(node => {
        this.allNodes.push(node);
      })
    }
  }

  setRoot(node) {
    this.root = node;
    this.allNodes = [this.root];
  }
  addIterable(iterable) {
    // console.log("iterable: ", iterable, Array.isArray(iterable))
    let node = this.root;
    for (let i = 0; i < iterable.length; i++) {
      let char = iterable[i];

      // additional check for recursive stacks
      if (Array.isArray(char)) {
        // console.log("got here: ", char)
        this.addIterable(char);
        continue;
      }

      if (node.hasNext(char)) {
        node = node.getNext(char);
      } else {
        let nextNode = new TrieNode(char);
        this.allNodes.push(nextNode);
        node.addNext(nextNode);
        node = nextNode;
      }
      node.addWeight();
    }
  }
  getNext(iterable) {
    let node = this.root;
    for (let i = 0; i < iterable.length; i++) {
      let char = iterable[i];
      if (node.hasNext(char)) {
        node = node.getNext(char);
      } else { // dead end set node back to root
        node = this.root;
      }
    }
    return Object.values(node.next).sort((a,b) => b.getWeight()-a.getWeight());
  }

  autoComplete(iterable, outputArray) {
    let node = this.root;
    for (let i = 0; i < iterable.length; i++) {
      let char = iterable[i];
      if (node.hasNext(char)) {
        node = node.getNext(char);
      } else { // dead end set node back to root
        node = this.root;
      }
    }
    return node.getAllWords(outputArray);
  }

  autoCompleteAll(baseIterable, outputArray) {
    let out = []
    for (let i = 0; i < baseIterable.length; i++) {
      out = out.concat(this.autoComplete(baseIterable.slice(i,baseIterable.length),outputArray));
    }
    return out;
  }


  autoSuggest(block) {
    let out = [];
    this.allNodes.forEach(node => {
      if (node.getValue() == block) {
        out = out.concat(node.getAllNext());
      }
    });
    return Array.from(new Set(out));
  }

  toObject() {
    return this.root.toObject();
  }
  static fromObject(obj) {
     let out = new Trie();
     out.setRoot(TrieNode.fromObject(obj));
     out.setAllNodes();
     return out;
  }

  saveToOutput(filename) {
    let obj = this.toObject();
    fs.writeFile(`./output/${filename}.json`, JSON.stringify(obj,null,2),() => null); 
  }
}


module.exports = {
  TrieNode,
  Trie
}