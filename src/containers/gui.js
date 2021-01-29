import React from 'react';
import {connect} from 'react-redux';
import VM from 'scratch-vm';

import {setProjectRunState} from '../reducers/project-state.js';
import {clearThePixels} from '../reducers/pixels.js';

import GUIComponent from '../components/gui/gui.js';

class GUI extends React.Component {
    constructor (props) {
        super(props);
        this.vm = new VM();
    }

    componentDidMount () {
        this.vm.on('PROJECT_RUN_START', this.props.setProjectRunning);
        this.vm.on('PROJECT_RUN_STOP', this.props.setProjectStopped);

        // whenever the start button is pressed again, it resets the board and clears the stitches
        this.vm.on('PROJECT_RUN_START', this.props.clearPixels);
    }

    componentWillUnmount () {
        this.vm.removeListener('PROJECT_RUN_START', this.props.setProjectRunning);
        this.vm.removeListener('PROJECT_RUN_STOP', this.setProjectStopped);
    }

    render () {
        const {...componentProps} = this.props;
        return (
            <GUIComponent
                vm={this.vm}
                {...componentProps}
            />
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
