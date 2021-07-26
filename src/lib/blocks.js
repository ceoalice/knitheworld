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

    getWorkspace() {
      return this.workspace;
    }
    resize() {
      try {
        ScratchBlocks.svgResize(this.workspace);
      } catch {
        console.log("IDK something went wrong")
      }
    }

    setCallbackProcedure(callback) {
      ScratchBlocks.Procedures.externalProcedureDefCallback = callback;
    }
    setCallbackMessage(callback) {
      ScratchBlocks.Procedures.externalProcedureDefCallback = callback;
    }
    setCallbackVariable(callback) {
      ScratchBlocks.Procedures.externalProcedureDefCallback = callback;
    }
    setCallbackList(callback) {
      ScratchBlocks.Procedures.externalProcedureDefCallback = callback;
    }

    loadXML (xml) {
        const domXML = ScratchBlocks.Xml.textToDom(xml);
        ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(domXML, this.workspace);              
    }

    getXML () {
        return ScratchBlocks.Xml.domToText(ScratchBlocks.Xml.workspaceToDom(this.workspace));
    }
}

export default new VMScratchBlocks();