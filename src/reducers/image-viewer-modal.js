const SET_SRC = 'setSrc';

const initialState = {
    src: null
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch(action.type) {
    case SET_SRC:
        return Object.assign({}, state, {
            src: action.src
        });
    default:
        return state;
    }
};

const setImageViewerModalSrc = function (src) {
    return {
        type: SET_SRC,
        src: src
    };
};

export {
    reducer as default,
    initialState as imageViewerModalInitialState,
    setImageViewerModalSrc
};
