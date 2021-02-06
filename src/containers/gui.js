import React from 'react';
import {connect} from 'react-redux';
import VM from 'scratch-vm';

import {setProjectRunState} from '../reducers/project-state.js';
import {clearThePixels} from '../reducers/pixels.js';

import GUIComponent from '../components/gui/gui.js';

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

class GUI extends React.Component {
    constructor (props) {
        super(props);
        this.vm = new VM();
        this.state = {
          blockKeys: []
        };
        this.vm.on('PROJECT_CHANGED', () => {
            let currentBlocks = this.vm.runtime.targets[0].blocks._blocks;
            if (currentBlocks !== this.state.blockKeys){
              console.log("changed!");
              this.setState({blockKeys: Object.keys(this.vm.runtime.targets[0].blocks._blocks)});
              this.componentDidMount();
            }
            console.log(this.vm.runtime.targets[0].blocks._blocks);
            console.log(Object.keys(this.vm.runtime.targets[0].blocks._blocks));
        });
    }

    componentDidMount () {
        this.vm.on('PROJECT_RUN_START', this.props.setProjectRunning);
        this.vm.on('PROJECT_RUN_STOP', this.props.setProjectStopped);
    }

    componentWillUnmount () {
        this.vm.removeListener('PROJECT_RUN_START', this.props.setProjectRunning);
        this.vm.removeListener('PROJECT_RUN_STOP', this.setProjectStopped);
    }

    render () {
        const {...componentProps} = this.props;
        return (
          //<TransformWrapper>
            //<TransformComponent>
              <GUIComponent
                vm={this.vm}
                {...componentProps}
              />
            //</TransformComponent>
          //</TransformWrapper>
        );
    }
}

const mapStateToProps = state => ({
    fullscreenVisible: state.modals.fullscreenSimulator,
    bluetoothConnected: state.bluetooth.connectionStatus,
    images: state.images
});

const mapDispatchToProps = dispatch => ({
    setProjectRunning: () => dispatch(setProjectRunState(true)),
    setProjectStopped: () => dispatch(setProjectRunState(false)),
    clearPixels: () => dispatch(clearThePixels())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GUI);
