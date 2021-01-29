import ScratchBlocks from 'scratch-blocks';

class VMScratchBlocks {
    constructor () {

    }

    setVM (vm) {
        this.vm = vm;
    }

    injectBlocks (blocks, options, toolbox) {
        this.workspace = ScratchBlocks.inject(blocks, {
            ...options,
            ...{toolbox: toolbox}
        });
        return this.workspace;
    }

    loadWorkspace (workspace) {
        this.workspace.clear();
        const xml = ScratchBlocks.Xml.textToDom(workspace);
        ScratchBlocks.Xml.domToWorkspace(xml, this.workspace);
    }

    getXML () {
        return ScratchBlocks.Xml.workspaceToDom(this.workspace);
    }
}

const vmScratchBlocks = new VMScratchBlocks();

export default vmScratchBlocks;

// export default function(vm) {
    // return ScratchBlocks;
// }
