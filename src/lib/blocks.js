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
        const xml = ScratchBlocks.Xml.textToDom(workspace);
        // console.log("textToDom done")
        console.log("domToWorkspace")

        ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(xml, this.workspace);
        
        console.log("domToWorkspace done");
        // new Promise(resolve => {
          
        //   resolve();
        // });

              
    }

    getXML () {
        return ScratchBlocks.Xml.domToText(ScratchBlocks.Xml.workspaceToDom(this.workspace));
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
