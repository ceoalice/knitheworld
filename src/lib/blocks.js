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
        return ScratchBlocks.Xml.domToPrettyText(ScratchBlocks.Xml.workspaceToDom(this.workspace));
    }

    loadXML (xml) {
        var domXML = ScratchBlocks.Xml.textToDom(xml);
            // var blocks = xml.getElementsByTagName('block');
            // for (let i=0; i<blocks.length; i++) {
            //     const name = blocks.item(i).getAttribute('type');
            //     if (name.includes('button_') || name.includes('light_')) {
            //         const type = name.split('_')[0];
            //         const id = name.split('_').pop();
            //         window.createNodeBlocks(type, id);
            //     }
            // }
        setTimeout(() => {
            ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(domXML, this.workspace);
        }, 200); //TODO Do this step after the extensions are properly loaded
    }
}

const vmScratchBlocks = new VMScratchBlocks();

export default vmScratchBlocks;

// export default function(vm) {
    // return ScratchBlocks;
// }
