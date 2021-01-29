import {
    FieldSymbols,
    BlockSymbols
} from './symbols.js';

class Block {
    constructor (target, block) {
        this._target = target;
        this._block = block;
    }
}

class BlockEncoder {

    constructor (runtime) {
        this._runtime = runtime;
        this._supportedHats = [];
        this.variables = [];
        this.subscriptions = [];
    }

    getStacks () {
        let hats = this.getHats();
        let stacks = [];
        let subs = [];
        let targets = [];
        hats.forEach(h => {
            const hat = this.encodeBlock(h, subs, targets);
            if (h._block.next) {
                const start = new Block(h._target, h._target.blocks.getBlock(h._block.next));
                let stack = this.parseStack(start, subs, targets);
                stack.blocks = hat.concat(stack.blocks);
                stacks.push(stack);
            }
        });
        return stacks;
    }

    compileStacks (stacks, vectors, procs) {
        for (let i=0; i<stacks.length; i++) {
            let hat = stacks[i].shift();
            let res = this.encodeStack(stacks[i]);
            res.unshift(0);
            res.push(9);
            let vect = [hat[2], 0x40+procs.length, 0, 0];
            vectors.splice(i*4, 4, ...vect);
            for (let i=0; i<res.length; i++)
                procs.push(res[i]);
        }
     }

    encodeStack (stack) {
        let res = [];
        let lists = [];
        for (let i in stack) {
            this.encodeItem(stack[i], res, lists);
        }
        return res;
    }

    encodeItem (item, res, lists) {
        let val = item[1];
        switch(item[0]) {
        case 'byte':
                res.push(1);
                res.push(val & 0xFF);
                break;
        case 'number':
                res.push(2);
                res.push(val & 0xFF);
                res.push((val >> 8) & 0xFF);
                res.push((val >> 16) & 0xFF);
                res.push((val >> 24) & 0xFF);
                break;
        case 'prim':
                let sym;
                Object.keys(BlockSymbols).forEach(key => {
                    if (item[1].includes(key)) {
                        sym = BlockSymbols[key];
                    }
                });
                res.push(sym.byte);
                break;
        case 'list':
                res.push(3);
                lists.push(res.length);
                res.push(0);
                res.push(0);
                break;
        case 'eol':
                res.push(4);
                let offset = lists.pop();
                let len = res.length - offset - 2;
                res[offset] = len & 0xFF;
                res[offset+1] = (len>>8) & 0xFF;
                break;
        default:
                console.log('Error symbol not found ' + item[0]);
        }
    }

    getHats () {
        let hats = []
        this._runtime.executableTargets.forEach(target => {
            // Filter for only top level blocks
            target.blocks.getScripts().forEach(b => {
                let block = target.blocks.getBlock(b);
                // If top level block is a hat block
                if (this._runtime._hats[block.opcode]) {
                    hats.push(new Block(target, block));
                    // Create a new "stack" of blocks
                    // blockScript.push(this.stackToArray(target, block));
                }
            })
        });
        return hats;
    }

    parseStack (start, subs, targets) {
        let stack = this.encodeBlock(start, subs, targets);
        let nextBlock = start._target.blocks.getBlock(start._block.next);
        while (nextBlock) {
            let array = this.encodeBlock(new Block(start._target, nextBlock), subs, targets);
            if (array != null) stack = stack.concat(array);
            nextBlock = start._target.blocks.getBlock(nextBlock.next);
        }
        return {blocks: stack, subs: subs, targets: targets};
    }

    encodeBlock (block, subs, targets) {
        let blockSym;
        Object.keys(BlockSymbols).forEach(key => {
            if (block._block.opcode.includes(key)) {
                blockSym = BlockSymbols[key];
            }
        });
        if (!blockSym) {
            console.log("Error: Unknown symbol " + block._block.opcode);
            return;
        }
        let hat = [blockSym.type, block._block.opcode];
        if (block._block.opcode === 'event_whenstarted') hat.push(8);
        else if (block._block.opcode.includes('button_whenPressed_')) {
            const subAddr = block._block.opcode.split('button_whenPressed_')[1];
            const subID = subs.indexOf(subAddr);
            if (subID >= 0) {
                hat.push(0x90+subID);
            } else {
                hat.push(0x90+(subs.push(subAddr)-1));
            }
        } else if (block._block.opcode.includes('light_toggleLED_')) {
            const tgtAddr = block._block.opcode.split('light_toggleLED_')[1];
            targets.push(tgtAddr);
        } else if (block._block.opcode.includes('light_setLED_')) {
            const tgtAddr = block._block.opcode.split('light_setLED_')[1];
            targets.push(tgtAddr);
        } else if (block._block.opcode.includes('light_changeLEDColor_')) {
            const tgtAddr = block._block.opcode.split('light_changeLEDColor_')[1];
            targets.push(tgtAddr);
        } else if (block._block.opcode.includes('light_setLEDColor_')) {
            const tgtAddr = block._block.opcode.split('light_setLEDColor_')[1];
            targets.push(tgtAddr);
        } else if (block._block.opcode.includes('motor_setMotorOn_')) {
            const tgtAddr = block._block.opcode.split('motor_setMotorOn_')[1];
            targets.push(tgtAddr);
        }
        let out = []
        out.unshift(hat);
        let inputs = [];
        let variables = [];
        for (const n in block._block.fields) {
            const field = block._block.fields[n];
            if (field.name === "VARIABLE") {
                let name = field.value;
                let id = this.variables.indexOf(name);
                if (id < 0) id = this.variables.push(name) - 1;
                inputs.push(['byte', id]);
            } else if (field.name === 'STATE') {
                if (field.value === 'on') inputs.push(['byte', 1]);
                else inputs.push(['byte', 0]);
            }
            // if (block.opcode === 'control_stop') {
              // // inputs.push(block.fields[n].value);
            // } else {
                // console.log("Uknown field: " + block.fields[n]);
            // }
        }
        for (const n in block._block.inputs) {
            let input = block._target.blocks.getBlock(block._block.inputs[n].block);
            if (n === 'SUBSTACK') {
                const stack = this.parseStack(new Block(block._target, block._target.blocks.getBlock(block._block.inputs[n].block)), subs, targets);
                console.log(stack);
                // let loop = this.stackToArray(block._target, input);
                stack.blocks.unshift(['list', 1]);
                stack.blocks.push(['eol', 0]);
                inputs = inputs.concat(stack.blocks);
            } else if (this._runtime._primitives[input.opcode]) {
                const array = this.encodeBlock(new Block(block._target, input));
                if (array[0][1] === 'circuitplayground_isButtonPressed') {
                    array[0][1] += '_' + block._target.blocks.getBlock(input.inputs.BTN.block).fields.buttons.value;
                }
                if (array !== null) {
                    if (block._block.opcode === 'control_wait_until' ||
                        block._block.opcode === 'control_repeat_until') {
                        array.unshift(['list', 1]);
                        array.push(['eol', 0]);
                    }
                    inputs = inputs.concat(array);
                } else inputs.push(['byte', 0]);
            } else {
                for (const v in input.fields) {
                    if (block._block.opcode === "circuitplayground_whenMeshBroadcast")
                        break;
                    let field = input.fields[v];
                    if (field.name === 'NUM' ||
                        (field.name === 'TEXT' && !isNaN(field.value))) {
                        let val = parseFloat(field.value);
                        if (isNaN(val)) {
                            inputs.push(['byte', 0]);
                        // } else if (val < 256 && val >= 0 && val == Math.round(val)) {
                        } else if (val > -128 && val < 256 && val == Math.round(val)) {
                            inputs.push(['byte', val]);
                        } else {
                            inputs.push(['number', val*100]);
                        }
                    } else if (field.name === 'TEXT') {
                        console.log("TODO: Implement String");
                    } else if (field.name === 'MATRIX') {
                        let symbol = this._convertSymbol(field.value);
                        for (let i=0; i<4; i++) {
                            inputs.push(['byte', (symbol >> (24 - (i*8))) & 0xFF]);
                        }
                    } else if (field.name === 'NEOPIXEL_RING') {
                        let value = field.value.split(',');
                        console.log(value);
                        for (let i=0; i<value.length; i+=4) {
                            let state = parseInt(value[i]);
                            let color = parseInt(value[i+1]) << 16 |
                                   parseInt(value[i+2]) << 8 |
                                   parseInt(value[i+3]);
                            if (state && color > 0) {
                                inputs.push(['number', color*100]);
                            } else {
                                inputs.push(['byte', 0]);
                            }
                        }
                    } else if (field.name === 'buttons') {
                        if (BlockSymbols[block._block.opcode].type === 'hat') {
                            if (field.value === 'A')
                                hat.push(0x80);
                            else if (field.value === 'B')
                                hat.push(0x81);
                        } else {
                            console.log(field);
                        }
                    } else if (FieldSymbols[field.name])   {
                        inputs.push([FieldSymbols[field.name].type, FieldSymbols[field.name].values[field.value]]);
                    } else if (field.name === 'NOTE') {
                        const note = parseInt(field.value);
                        const freq = parseInt(16.35 * (Math.pow(2, (note/12))));
                        if (freq > 255)
                            inputs.push(['number', freq])
                        else
                            inputs.push(['byte', freq])
                    } else {
                        console.log("Unknown field type: " + field.name);
                    }
                    break;
                }
            }
        }
        out = inputs.concat(out);
        return out;
    }
    // next () {
        // console.log(blockScript);
        // console.log(JSON.stringify(blockScript));
        // this.vectors = [];
        // for (let i=0; i<64; i++) this.vectors[i] = 0;
        // this.procs = [];
        // // if (blockScript[0][0][1] === 'event_whenflagclicked') {
        // for (let i=0; i<blockScript.length; i++) {
            // this.compileStack(blockScript[i], i);
        // }
        // let out = [252, 0, 0, 3, 0];
        // for (let i=0; i<(this.procs.length%8); i++) this.procs.push(255);
        // console.log(this.vectors);
        // console.log(this.procs);
        // out.push(this.vectors.length + this.procs.length);
        // out = out.concat(this.vectors);
        // out = out.concat(this.procs);
        // // out.push(0);
        // console.log(out);
    // }
}

export default BlockEncoder;
