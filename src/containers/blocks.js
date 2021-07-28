import React from 'react';
import PropTypes from 'prop-types';
import {bindAll} from "lodash";
import {connect} from 'react-redux';
import VM from 'scratch-vm';

import { clearThePixels } from '../reducers/pixels.js';

import VMScratchBlocks from '../lib/blocks.js';
import ProjectAPI from '../lib/project-api.js';

import defaultToolbox, {getToolBox} from '../lib/toolbox.js';
import UserManager from '../lib/user-manager.js';

import BlocksComponent from '../components/blocks/blocks.js';
import Popover from "../components/popover/popover.js";

class Blocks extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
          anchorEl : null,
          anchorElOpen : false
        }
        
        VMScratchBlocks.setVM(props.vm);
        ProjectAPI.setVM(props.vm);
        UserManager.setVM(props.vm);
        
        bindAll(this,[
          'setBlocks',
          'attachVM',
          'detachVM',
          'onScriptGlowOn',
          'onScriptGlowOff',
          'onBlockGlowOn',
          'onBlockGlowOff',
          'onVisualReport',
          'handleSuggest',
          'popoverOffClick',
          'setPopoverAnchorEl',
          'popoverAnchorClicked'
        ])
    }

    componentDidMount () {
        this.props.vm.loadProject(Blocks.defaultProject).then(() => {
            this.workspace = VMScratchBlocks.injectBlocks(
                this.blocks, Blocks.defaultOptions, defaultToolbox
            );

            let params = new URLSearchParams(window.location.search)
            
            // if (params.has('projectID')) {
              
            // } 

            ProjectAPI.loadCurrentProject();

            this.attachVM();
        }).then(() => {
          this.setPopoverAnchorEl();
        });

        window.addEventListener('click', this.popoverOffClick);
        this.props.clearPixels();
        this.props.vm.start();
    }

    componentWillUnmount () {
      window.removeEventListener('click', this.popoverOffClick)
      this.state.anchorEl.removeEventListener('click', this.popoverAnchorClicked);
    }

    setPopoverAnchorEl() {
      // scratchCategoryId-suggestions -> generated from id="suggestions" 
      // in the <category> tag in lib/toolbox.js
      const el = document.getElementsByClassName("scratchCategoryId-suggestions")[0];

      if (el) {
        this.setState({anchorEl : el}, () => {
          this.state.anchorEl.addEventListener('click', this.popoverAnchorClicked);
        });
      }
    }

    popoverOffClick(e) {
      if (this.state.anchorElOpen) {
        this.setState({anchorElOpen : false});
        e.preventDefault(); 
      }
    }

    popoverAnchorClicked() {   
      if (this.state.anchorElOpen) {
        this.setState({anchorElOpen : false})
      }
    }

    handleSuggest(suggestions) {
      console.log({suggestions})
      if (!this.state.anchorElOpen) this.setState({anchorElOpen : true});
      this.workspace.updateToolbox( getToolBox(suggestions) );
      this.setPopoverAnchorEl();
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
        this.props.vm.addListener('SUGGEST_EVENT', this.handleSuggest);
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

    render () {
        const {
          clearPixels,
          ...otherProps
        } = this.props;

        return (
            <React.Fragment>
                <Popover
                  open={this.state.anchorElOpen} 
                  anchorEl={this.state.anchorEl}
                  onClick={this.popoverAnchorClicked}
                >
                  <div> New Suggestions </div>
                </Popover>

                <BlocksComponent
                    containerRef={this.setBlocks}
                    {...otherProps}
                />
            </React.Fragment>
        );
    }
}

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
        controls: true,
        startScale: 0.75,
        wheel: true
    },
    grid: {
        spacing: 40,
        length: 2,
        colour: '#ccc'
    },
    colours: {
        workspace: '#f4f4f4',
        flyout: '#8ec6c5',
        toolbox: '#6983aa',
        toolboxText: '#ffffff',
        toolboxHover: '#cccc00',
        toolboxSelected: '#5a7090',
        scrollbar: '#CECDCE',
        scrollbarHover: '#CECDCE',
        insertionMarker: '#FFFFFF',
        insertionMarkerOpacity: 0.2,
        fieldShadow: 'rgba(255, 255, 255, 0.3)',
        dragShadowOpacity: 0.6
    },
    comments: true,
    collapse: true,
    horizontalLayout: false,
    toolboxPosition: 'beginning',
    scrollbars: true,
    media: './static/blocks-media/',
    sounds: false
};

Blocks.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
};

const mapDispatchToProps = dispatch => ({
    clearPixels: () => dispatch(clearThePixels())
});

export default connect(
    null,
    mapDispatchToProps
)(Blocks);
