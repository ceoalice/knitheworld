import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {setConnectionStatus} from '../reducers/bluetooth.js';

import WebBluetooth from '../lib/webbt.js';

import WebBTButtonComponent from '../components/webbt-button/webbt-button.js';

class WebBTButton extends React.Component {
    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
    }

    componentDidMount () {
        WebBluetooth.registerConnectCallback(this.onConnect);
        WebBluetooth.registerDisconnectCallback(this.onDisconnect);
    }

    componentWillUnmount () {
        WebBluetooth.removeConnectCallback(this.onConnect);
        WebBluetooth.removeDisconnectCallback(this.onDisconnect);
    }

    handleClick () {
        WebBluetooth.scan();
    }

    onConnect () {
        this.props.onConnectionStatusUpdate(true);
    }

    onDisconnect () {
        this.props.onConnectionStatusUpdate(false);
    }

    render () {
        return (
            <WebBTButtonComponent
                handleClick={this.handleClick}
            />
        );
    }
}

WebBTButton.propTypes = {
    onConnectionStatusUpdate: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
    onConnectionStatusUpdate: status => dispatch(setConnectionStatus(status))
});

export default connect(
    null,
    mapDispatchToProps
)(WebBTButton);
