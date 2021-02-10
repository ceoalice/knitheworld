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
        this.state = {
          blockKeys: [],
          fieldValues: [],
          startupToggle: false
        };
        this.vm.on('PROJECT_CHANGED', () => {

          // https://stackoverflow.com/questions/25469972/getting-the-values-for-a-specific-key-from-all-objects-in-an-array
          let blockParentIDs = Object.values(this.vm.runtime.targets[0].blocks._blocks).map(value => value.parent);

          // https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
          var filteredBlockParentIDs = blockParentIDs.filter(function (el) {
            return el != null;
          });


          let blockFields = Object.values(this.vm.runtime.targets[0].blocks._blocks).map(value => value.fields);

          var blockFieldIDs = []

          for (var i in blockFields){
            blockFieldIDs.push(Object.values(blockFields[i]).map(value => value.value));
          }

          var filteredBlockFieldIDs = blockFieldIDs.filter(function (el) {
            return el.length != 0;
          });

          // https://www.30secondsofcode.org/blog/s/javascript-array-comparison
          const equals = (a, b) =>
            a.length === b.length &&
            a.every((v, i) => v === b[i]);

          // since we can't init BlockKeys in the constructor with values from the runtime,
          // we use this toggle to init the value once the comopnent is constructed
          if (this.state.startupToggle === false) {
            this.setState({blockKeys: filteredBlockParentIDs});
            this.setState({fieldValues: filteredBlockFieldIDs});
            this.setState({startupToggle: true});
          } else {
            if (equals(filteredBlockParentIDs,this.state.blockKeys) === false || equals(filteredBlockFieldIDs,this.state.fieldValues) === false){

              console.log("updating canvas...");
              this.setState({blockKeys: filteredBlockParentIDs});
              // trigger an update here somehow!
              this.props.clearPixels();
              this.vm.runtime.startHats('event_whenstarted');
            }
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
