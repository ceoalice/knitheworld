const BLOCK_TRIGGER = 'blockTrigger';

const initialState = {
    [BLOCK_TRIGGER]: []
};

const reducer = function(state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case BLOCK_TRIGGER:
        return Object.assign({}, state, {
            [action.type]: action.state
        });
    default:
        return state;
    }
};

const updateBlockTriggers = function(state) {
    return {
        type: BLOCK_TRIGGER,
        state: state
    };
};

export {
    reducer as default,
    initialState as sensorInitialState,
    updateBlockTriggers
};
