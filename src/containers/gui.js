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
          blockKeys: [],
          startupToggle: false
        };
        this.vm.on('PROJECT_CHANGED', () => {

          // https://stackoverflow.com/questions/25469972/getting-the-values-for-a-specific-key-from-all-objects-in-an-array
          let blockParentIDs = Object.values(this.vm.runtime.targets[0].blocks._blocks).map(value => value.parent);

          // https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
          var filteredBlockParentIDs = blockParentIDs.filter(function (el) {
            return el != null;
          });

          // https://www.30secondsofcode.org/blog/s/javascript-array-comparison
          const equals = (a, b) =>
            a.length === b.length &&
            a.every((v, i) => v === b[i]);

          // since we can't init BlockKeys in the constructor with values from the runtime,
          // we use this toggle to init the value once the comopnent is constructed
          if (this.state.startupToggle === false) {
            console.log("toggled, init");
            this.setState({blockKeys: filteredBlockParentIDs});
            this.setState({startupToggle: true});
          }

          if (equals(filteredBlockParentIDs,this.state.blockKeys) === false && this.state.startupToggle === true){
            console.log("changed!");
            this.setState({blockKeys: filteredBlockParentIDs});
            this.props.clearPixels();
          }
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
