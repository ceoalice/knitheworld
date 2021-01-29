import {BlockSymbols} from './symbols.js';

class BlockDecoder {
    constructor () {
        this.bytes = null;
        this.pointer = 0;
        this.values = [];
    }

    pop () {
        return this.bytes[this.pointer++];
    }

    eval (byte) {
        const symbol = this.findSymbol(byte);
        switch (symbol) {
        case 'byte': {
            const val = this.pop();
            this.values.push({
                type: 'number',
                value: val
            });
            break;
        }
        case 'num': {
            let val = this.pop();
            val |= this.pop() << 8;
            val |= this.pop() << 16;
            val |= this.pop() << 24;
            this.values.push({
                type: 'number',
                value: val / 100
            });
            break;
        }
        case 'list': {
                let length = this.pop();
                const stack = this.getStacks();
                const block = this.eval(this.pop());
                block.substack = stack;
                return block;
            }
        case 'eol':
            console.log('End of list');
            break;
        default:
            if (symbol) {
                const block = {
                    block: symbol,
                    values: [...this.values]
                };
                this.values = [];
                return block;
            } else {
                console.log('Uknown symbol', byte);
            }
        }
    }

    getStacks () {
        let byte = this.pop();
        const stack = [];
        let prev = null;
        while (byte !== 9 && byte !== 4) {
            const ret = this.eval(byte);
            if (ret) {
                if (prev) {
                    prev.next = ret;
                } else {
                    stack.push(ret);
                }
                prev = ret;
            }
            byte = this.pop();
        }
        return stack;
    }

    findSymbol (byte) {
        return Object.keys(BlockSymbols).find(key =>
            BlockSymbols[key].byte === byte
        );
    }

    blockToXML (b) {
        const doc = document.implementation.createDocument('', '', null);
        const block = doc.createElement('block');
        block.setAttribute('type', b.block);
        if (b.values) {
            b.values.forEach((val, index) => {
                const arg = BlockSymbols[b.block].args[index];
                const value = doc.createElement('value');
                value.setAttribute('name', 'VALUE');
                const shadow = doc.createElement('shadow');
                shadow.setAttribute('type', arg.shadow);
                const field = doc.createElement('field');
                field.setAttribute('name', arg.type);
                field.innerHTML = val.value;
                shadow.appendChild(field);
                value.appendChild(shadow);
                block.appendChild(value);
            });
        }
        if (b.substack) {
            const substack = this.blockToXML(b.substack[0]);
            const statement = doc.createElement('statement');
            statement.setAttribute('name', 'SUBSTACK');
            statement.appendChild(substack);
            block.appendChild(statement);
        }
        if (b.next) {
            const next = doc.createElement('next');
            next.appendChild(this.blockToXML(b.next));
            block.appendChild(next);
        }
        return block;
    }

    stackToXML (stack) {
        const doc = document.implementation.createDocument('', '', null);
        let block = stack.shift();
        let prev = doc;
        let xml = this.blockToXML(block);
        return xml;
    }

    toXML (hatOp, stacks) {
        const doc = document.implementation.createDocument('', '', null);
        const xml = doc.createElement('xml');
        const hat = this.blockToXML({block: hatOp});
        hat.setAttribute('deleteable', 'false');
        hat.setAttribute('x', '25');
        hat.setAttribute('y', '50');
        const stack = this.stackToXML(stacks, doc);
        const next = doc.createElement('next');
        next.appendChild(stack);
        hat.appendChild(next);
        xml.appendChild(hat);
        doc.appendChild(xml);
        return doc;
    }

    decode (bytes) {
        this.bytes = bytes;
        this.pointer = 0;
        const hat = this.findSymbol(bytes[0]);
        this.pointer = this.bytes[++this.pointer]+1;
        const stacks = this.getStacks();
        const xml = this.toXML(hat, stacks);
        return new XMLSerializer().serializeToString(xml);
    }
}

const blockDecoder = new BlockDecoder();

export default blockDecoder;
