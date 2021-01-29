import React from 'react';
import {connect} from 'react-redux';

import {closeFullscreenSimulator} from '../reducers/modals.js';

import SimulatorModalComponent from '../components/simulator-modal/simulator-modal.js';

class SimulatorModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const componentProps = {...this.props};
        return (
            <SimulatorModalComponent
                handleClose={this.props.onCloseFullscreen}
                {...componentProps}
            />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onCloseFullscreen: () => dispatch(closeFullscreenSimulator())
});

export default connect(
    null,
    mapDispatchToProps
)(SimulatorModal);
