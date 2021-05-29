import React from 'react';
import ShareProjectModaltModalComponent from '../components/share-modal/share-modal.js';
import { closeShareProject } from '../reducers/modals.js';

import {connect} from 'react-redux';

class ShareProjectModal extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <ShareProjectModaltModalComponent
                onCancel={this.props.onCancel}
            />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onCancel: () => dispatch(closeShareProject()) 
});

export default connect(
    null,
    mapDispatchToProps
)(ShareProjectModal);
