import React from 'react';
import ImageImportModalComponent from '../components/image-import-modal/image-import-modal.js';
import { closeImageImport } from '../reducers/modals.js';

import {connect} from 'react-redux';

class ImageImportModal extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <ImageImportModalComponent
                onCancel={this.props.onCancel}
            />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onCancel: () => dispatch(closeImageImport()) 
});

export default connect(
    null,
    mapDispatchToProps
)(ImageImportModal);
