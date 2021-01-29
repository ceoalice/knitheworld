const PROJECT_RUN_STATE = 'projectRunState';

const initialState = {
    [PROJECT_RUN_STATE]: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;

    switch (action.type) {
    case PROJECT_RUN_STATE:
        return Object.assign({}, state, {
            projectRunState: action.state
        });
    default:
        return state;
    }
};

const setProjectRunState = state => {
    return {
        type: PROJECT_RUN_STATE,
        state: state
    };
};

export {
    reducer as default,
    initialState as projectRunInitialState,
    setProjectRunState
};
