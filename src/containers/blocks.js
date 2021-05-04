import React from 'react';
import PropTypes from 'prop-types';

import VMScratchBlocks from '../lib/blocks.js';
import ProjectManager from '../lib/project-manager.js';
import VM from 'scratch-vm';
import BlocksComponent from '../components/blocks/blocks.js';

import defaultToolbox from '../lib/default-toolbox.js';

import {connect} from 'react-redux';

import { clearThePixels } from '../reducers/pixels.js';


class Blocks extends React.Component {
    constructor (props) {
        super(props);
        // this.ScratchBlocks = VMScratchBlocks(props.vm);
        VMScratchBlocks.setVM(props.vm);
        this.setBlocks = this.setBlocks.bind(this);
        this.attachVM = this.attachVM.bind(this);
        this.detachVM = this.detachVM.bind(this);
        this.onScriptGlowOn = this.onScriptGlowOn.bind(this);
        this.onScriptGlowOff = this.onScriptGlowOff.bind(this);
        this.onBlockGlowOn = this.onBlockGlowOn.bind(this);
        this.onBlockGlowOff = this.onBlockGlowOff.bind(this);
        this.onVisualReport = this.onVisualReport.bind(this);
        this.getBlocks = this.getBlocks.bind(this);
    }

    componentDidMount () {
        this.props.vm.loadProject(Blocks.defaultProject).then(() => {
            this.workspace = VMScratchBlocks.injectBlocks(
                this.blocks, Blocks.defaultOptions, defaultToolbox
            );
            // this.workspace = this.ScratchBlocks.inject(this.blocks, {
                // ...Blocks.defaultOptions,
                // ...{toolbox: defaultToolbox}
            // });
            // VMScratchBlocks.loadWorkspace(Blocks.defaultWorkspace);
            ProjectManager.loadCurrentProject();

            // const xml = this.ScratchBlocks.Xml.textToDom(Blocks.defaultWorkspace);
            // this.ScratchBlocks.Xml.domToWorkspace(xml, this.workspace);
            // this.workspace.getFlyout().autoClose = true;
            // this.workspace.getFlyout().width_ = 0;
            this.attachVM();
        });
        this.props.clearPixels();
        console.log("here?");
        this.props.vm.start();
    }

    componentWillUnmount () {

    }

    attachVM () {
        this.workspace.addChangeListener(this.props.vm.blockListener);
        this.flyoutWorkspace = this.workspace.getFlyout().getWorkspace();
        this.flyoutWorkspace.addChangeListener(this.props.vm.flyoutBlockListener);
        this.flyoutWorkspace.addChangeListener(this.props.vm.monitorBlockListener);
        this.props.vm.addListener('SCRIPT_GLOW_ON', this.onScriptGlowOn);
        this.props.vm.addListener('SCRIPT_GLOW_OFF', this.onScriptGlowOff);
        this.props.vm.addListener('BLOCK_GLOW_ON', this.onBlockGlowOn);
        this.props.vm.addListener('BLOCK_GLOW_OFF', this.onBlockGlowOff);
        this.props.vm.addListener('VISUAL_REPORT', this.onVisualReport);
    }

    detachVM () {

    }

    onScriptGlowOn (data) {
        this.workspace.glowStack(data.id, true);
    }
    onScriptGlowOff (data) {
        this.workspace.glowStack(data.id, false);
    }
    onBlockGlowOn (data) {
        this.workspace.glowBlock(data.id, true);
    }
    onBlockGlowOff (data) {
        this.workspace.glowBlock(data.id, false);
    }
    onVisualReport (data) {
        this.workspace.reportValue(data.id, data.value);
    }
    setBlocks (blocks) {
        this.blocks = blocks;
    }
    getBlocks () {
        console.log(this.ScratchBlocks.Xml.workspaceToDom(this.workspace));
    }

    render () {
        const {
          currentProjectName,
          clearPixels,
          projectSaved,
          ...otherProps
        } = this.props;

        return (
            <React.Fragment>
              <div style={{
                  position : "absolute" , 
                  right: "0",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  zIndex: 100,
                  // backgroundColor: "#fff",
                  // borderRadius: "0.5rem",
                  padding: "3px",
                  minWidth: "100px"
                  // color: "#fff"
                  }}> {`${currentProjectName}`} </div>
                <BlocksComponent
                    containerRef={this.setBlocks}
                    {...otherProps}
                /> 
                
                {/* </BlocksComponent> */}
            </React.Fragment>
        );
    }
}

Blocks.defaultWorkspace =
`<xml>
  <block type="event_whenstarted" deletable="false" x="25" y="50">
    <next>
      <block type="knit_changecolorto">
        <value name="COLOR">
          <shadow type="colour_picker">
            <field name="COLOUR">#ffa686</field>
          </shadow>
        </value>
        <next>
          <block type="knit_castonstitches">
            <value name="VALUE">
              <shadow type="math_positive_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
            <next>
              <block type="control_repeat" id="control_repeat">
                <value name="TIMES">
                  <shadow type="math_whole_number">
                    <field name="NUM">5</field>
                  </shadow>
                </value>
                <statement name="SUBSTACK">
                  <block type="knit_changecolorto">
                    <value name="COLOR">
                      <shadow type="colour_picker">
                        <field name="COLOUR">#f7ed77</field>
                      </shadow>
                    </value>
                    <next>
                      <block type="knit_knituntilendofrow">
                        <next>
                          <block type="knit_changecolorto">
                            <value name="COLOR">
                              <shadow type="colour_picker">
                                <field name="COLOUR">#ffa686</field>
                              </shadow>
                            </value>
                            <next>
                              <block type="knit_knituntilendofrow">
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </statement>
                <next>
                  <block type="knit_changecolorto">
                    <value name="COLOR">
                      <shadow type="colour_picker">
                        <field name="COLOUR">#f7ed77</field>
                      </shadow>
                    </value>
                    <next>
                      <block type="knit_castoffstitches" id="knit_castoffstitches">
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`;

/*
<block type="event_whenstarted" deletable="false" x="25" y="50">
	<next>
		<block type="knit_changecolorto">
      <value name="COLOR">
        <shadow type="colour_picker">
        </shadow>
      </value>
      <next>
        <block type="knit_castonstitches">
          <value name="VALUE">
            <shadow type="math_positive_number">
              <field name="NUM">1</field>
            </shadow>
          </value>
          <next>
            <block type="control_repeat" id="control_repeat">
              <value name="TIMES">
                <shadow type="math_whole_number">
                  <field name="NUM">5</field>
                </shadow>
              </value>
              <statement name="SUBSTACK">
                <block type="knit_changecolorto">
                  <value name="COLOR">
                    <shadow type="colour_picker">
                    </shadow>
                  </value>
                  <next>
                    <block type="knit_knitstitches">
                      <value name="VALUE">
                        <shadow type="math_positive_number">
                          <field name="NUM">1</field>
                        </shadow>
                      </value>
                      <next>
                        <block type="knit_changecolorto">
                          <value name="COLOR">
                            <shadow type="colour_picker">
                            </shadow>
                          </value>
                          <next>
                            <block type="knit_knitstitches">
                              <value name="VALUE">
                                <shadow type="math_positive_number">
                                  <field name="NUM">1</field>
                                </shadow>
                              </value>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="knit_changecolorto">
                  <value name="COLOR">
                    <shadow type="colour_picker">
                    </shadow>
                  </value>
                  <next>
                    <block type="knit_castoffstitches" id="knit_castoffstitches">
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </next>
    </block>
	</next>
</block>



*/

/*

<block type="event_whenstarted" deletable="false" x="25" y="50">
  <next>
    <block type="control_forever">
      <statement name="SUBSTACK">
        <block type="knit_changecolorto">
          <value name="COLOR">
            <shadow type="colour_picker">
            </shadow>
          </value>
          <next>
            <block type="knit_knitstitches">
              <value name="VALUE">
                <shadow type="math_positive_number">
                  <field name="NUM">1</field>
                </shadow>
              </value>
              <next>
                <block type="control_waitms">
                  <value name="VALUE">
                    <shadow type="math_positive_number">
                      <field name="NUM">200</field>
                    </shadow>
                  </value>
                  <next>
                    <block type="knit_changecolorto">
                      <value name="COLOR">
                        <shadow type="colour_picker">
                        </shadow>
                      </value>
                      <next>
                        <block type="knit_knitstitches">
                          <value name="VALUE">
                            <shadow type="math_positive_number">
                              <field name="NUM">1</field>
                            </shadow>
                          </value>
                          <next>
                            <block type="control_waitms">
                              <value name="VALUE">
                                <shadow type="math_positive_number">
                                  <field name="NUM">200</field>
                                </shadow>
                              </value>
                            </block>
                          </next>
                        </block>
                      </next>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </next>
</block>


*/

{/* PREVIOUS DEFAULT CODE BLOCK
<block type="looks_changecolor">
  <value name="VALUE">
    <shadow type="math_integer">
      <field name="NUM">10</field>
    </shadow>
  </value>
  <next>
    <block type="control_waitms">
      <value name="VALUE">
        <shadow type="math_positive_number">
          <field name="NUM">50</field>
        </shadow>
      </value>
      <next>
        <block type="looks_forwardpixel">
          <value name="VALUE">
            <shadow type="math_positive_number">
              <field name="NUM">1</field>
            </shadow>
          </value>
        </block>
      </next>
    </block>
  </next>
</block> */}

Blocks.defaultProject = {
  "targets": [
    {
      "isStage": true,
      "name": "Stage",
      "variables": {},
      "lists": {},
      "broadcasts": {},
      "blocks": {},
      "currentCostume": 0,
      "costumes": [
      {
        "assetId": "cd21514d0531fdffb22204e0ec5ed84a",
        "name": "backdrop1",
        "bitmapResolution": 1,
        "md5ext": 'cd21514d0531fdffb22204e0ec5ed84a.svg',
        "dataFormat": "png",
        "rotationCenterX": 0,
        "rotationCenterY": 0,
        "skinId": null
      }
      ],
      "sounds": [],
      "volume": 100,
    }
  ],
  "meta": {
    "semver": "3.0.0",
    "vm": "0.1.0",
    "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
  }
};

Blocks.defaultOptions = {
    zoom: {
        startScale: 0.75,
        wheel: true
    },
    grid: {
        spacing: 40,
        length: 2,
        colour: '#ddd'
    },
    colours: {
        workspace: '#f4f4f4',
        flyout: '#8ec6c5',
        toolbox: '#6983aa',
        toolboxText: '#ffffff',
        toolboxHover: '#a3a3a3',
        toolboxSelected: '#5a7090',
        scrollbar: '#CECDCE',
        scrollbarHover: '#CECDCE',
        insertionMarker: '#FFFFFF',
        insertionMarkerOpacity: 0.2,
        fieldShadow: 'rgba(255, 255, 255, 0.3)',
        dragShadowOpacity: 0.6
    },
    comments: true,
    collapse: false,
    horizontalLayout: false,
    toolboxPosition: 'beginning',
    scrollbars: true,
    media: './static/blocks-media/',
    sounds: false
};

Blocks.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
    // currentProjectName: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  currentProjectName: state.projectState.currentProjectName,
  projectSaved: state.projectState.projectSaved
});

const mapDispatchToProps = dispatch => ({
    clearPixels: () => dispatch(clearThePixels())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Blocks);
