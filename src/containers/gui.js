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
        this.vm.on('PROJECT_CHANGED', () => {
            console.log(this.vm.runtime.targets[0].blocks._blocks);
        });
    }

    componentDidMount () {
        this.vm.on('PROJECT_RUN_START', this.props.setProjectRunning);
        this.vm.on('PROJECT_RUN_STOP', this.props.setProjectStopped);

        // whenever the start button is pressed again, it resets the board and clears the stitches

        // return new Promise (res => {
        //   this.vm.on('PROJECT_RUN_START', this.props.clearPixels);
        //   setTimeout(res, 500);
        // });
        // this.vm.on('PROJECT_RUN_STOP', this.props.clearPixels);
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
