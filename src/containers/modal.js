import { bindAll } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import ModalComponent from '../components/modal/modal.js';

class Modal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'addEventListeners',
            'removeEventListeners',
            'handlePopState',
            'pushHistory'
        ]);
        this.addEventListeners();
    }
    componentDidMount () {
        // Add a history event only if it's not currently for our modal. This
        // avoids polluting the history with many entries. We only need one.
        this.pushHistory(this.id, (history.state === null || history.state !== this.id));
    }
    componentWillUnmount () {
        this.removeEventListeners();
    }
    addEventListeners () {
        window.addEventListener('popstate', this.handlePopState);
    }
    removeEventListeners () {
        window.removeEventListener('popstate', this.handlePopState);
    }
    handlePopState () {
        // Whenever someone navigates, we want to be closed
        this.props.onRequestClose();
    }
    get id () {
        return `modal-${this.props.id}`;
    }
    pushHistory (state, push) {
        if (push) return history.pushState(state, this.id);
        history.replaceState(state, this.id);
    }
    render () {
        return <ModalComponent {...this.props} />;
    }
}

Modal.propTypes = {
    id: PropTypes.string.isRequired,
    isRtl: PropTypes.bool,
    onRequestClose: PropTypes.func,
    onRequestOpen: PropTypes.func
};

Modal.defaultProps = {
  isRtl: false
}

export default Modal;