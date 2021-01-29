const SET_CONNECTION_STATUS = 'setConnectionStatus';

const CONNECTION_STATUS = 'connectionStatus';

const initialState = {
    [CONNECTION_STATUS]: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_CONNECTION_STATUS:
        return Object.assign({}, state, {
            [CONNECTION_STATUS]: action.status
        });
    default:
        return state;
    }
};
const setConnectionStatus = function (status) {
    return {
        type: SET_CONNECTION_STATUS,
        status: status
    };
};
export {
    reducer as default,
    initialState as modalsInitialState,
    setConnectionStatus
};
