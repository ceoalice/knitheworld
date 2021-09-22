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
        ScratchBlocks.svgResize(this.getWorkspace());
      } catch (err) {
        // console.log("IDK something went wrong", err)
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

    loadXML (xml = VMScratchBlocks.BLANK_WORKSPACE) {
      const domXML = ScratchBlocks.Xml.textToDom(xml);
      ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(domXML, this.workspace);              
    }

    /**
     * 
     * @returns {String} XML string
     */
    getXML () {
      return ScratchBlocks.Xml.domToText(ScratchBlocks.Xml.workspaceToDom(this.workspace));
    }
}

VMScratchBlocks.BLANK_WORKSPACE =`<xml>
  <block type="event_whenstarted" deletable="false" x="25" y="50">
  </block>
</xml>`;


export default new VMScratchBlocks();