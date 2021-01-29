const OPEN_MODAL = 'OPEN_MODAL';
const CLOSE_MODAL = 'CLOSE_MODAL';

const MODAL_SIMULATOR = 'fullscreenSimulator';

const initialState = {
    [MODAL_SIMULATOR]: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case OPEN_MODAL:
        return Object.assign({}, state, {
            [action.modal]: true
        });
    case CLOSE_MODAL:
        return Object.assign({}, state, {
            [action.modal]: false
        });
    default:
        return state;
    }
};
const openModal = function (modal) {
    return {
        type: OPEN_MODAL,
        modal: modal
    };
};
const closeModal = function (modal) {
    return {
        type: CLOSE_MODAL,
        modal: modal
    };
};
const openFullscreenSimulator = function () {
    return openModal(MODAL_SIMULATOR);
};
const closeFullscreenSimulator = function () {
    return closeModal(MODAL_SIMULATOR);
};
export {
    reducer as default,
    initialState as modalsInitialState,
    openFullscreenSimulator,
    closeFullscreenSimulator
};
