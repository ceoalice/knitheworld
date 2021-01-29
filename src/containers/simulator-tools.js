import React from 'react';
import {connect} from 'react-redux';

import {setPixelType} from '../reducers/pixels.js';

import SimulatorToolsComponent from '../components/simulator-tools/simulator-tools.js';

class SimulatorTools extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SimulatorToolsComponent {...this.props} />
        );
    }
}

const mapStateToProps = state => ({
    pixelType: state.pixels.pixelType
});

const mapDispatchToProps = dispatch => ({
    setStyleRing: () => dispatch(setPixelType('ring')),
    setStyleStrip: () => dispatch(setPixelType('strip')),
    setStyleKnit: () => dispatch(setPixelType('knit'))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SimulatorTools);
