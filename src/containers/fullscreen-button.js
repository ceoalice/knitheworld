import React from 'react';
import {connect} from 'react-redux';

import {
    openFullscreenSimulator,
    closeFullscreenSimulator
} from '../reducers/modals.js';

import FullscreenButtonComponent from '../components/fullscreen-button/fullscreen-button.js';

class FullscreenButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.props.fullscreenVisible) {
            this.props.closeFullscreen();
            document.exitFullscreen();
        } else {
            this.props.openFullscreen();
            document.documentElement.requestFullscreen();
        }
    }

    render() {
        return (
            <FullscreenButtonComponent
                handleClick={this.handleClick}
                fullscreenVisible={this.props.fullscreenVisible}
            />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    openFullscreen: () => dispatch(openFullscreenSimulator()),
    closeFullscreen: () => dispatch(closeFullscreenSimulator())
});

export default connect(null, mapDispatchToProps)(FullscreenButton);
