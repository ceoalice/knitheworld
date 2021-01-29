const SENSOR_VALUE = 'sensorValue';

const initialState = {
    [SENSOR_VALUE]: 0
};

const reducer = function(state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SENSOR_VALUE:
        return Object.assign({}, state, {
            [action.type]: action.state
        });
    default:
        return state;
    }
};

const updateSensorValue = function(state) {
    return {
        type: SENSOR_VALUE,
        state: state
    };
};

export {
    reducer as default,
    initialState as sensorInitialState,
    updateSensorValue
};
