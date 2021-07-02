import React from 'react';
import JoinModaltModalComponent from '../components/join-modal/join-modal.js';
import { closeJoin } from '../reducers/modals.js';

import {connect} from 'react-redux';

class JoinModal extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <JoinModaltModalComponent
                onRequestClose={this.props.onCancel}
            />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onCancel: () => dispatch(closeJoin()) 
});

export default connect(
    null,
    mapDispatchToProps
)(JoinModal);
