const USERNAME = 'username';
const USER_ID = 'uid';
const USER_SIGNED_IN = "userSignedIn";
const USER_SIGNED_OUT = "userSignedOut";

const initialState = {
    [USER_SIGNED_IN]: false,
    [USERNAME]: "",
    [USER_ID] : ""
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;

    switch (action.type) {
    case USERNAME:
        return Object.assign({}, state, {
          [USERNAME]: action.value
        });
    case USER_SIGNED_IN:
      return Object.assign({}, state, {
        [USER_SIGNED_IN]: true,
        [USERNAME]: action[USERNAME],
        [USER_ID]: action[USER_ID],
      });
    case USER_SIGNED_OUT: 
      return Object.assign({}, state, {
        [USER_SIGNED_IN]: false,
        [USERNAME]: "",
        [USER_ID] : ""
      });
    default:
        return state;
    }
};

const updateUsername = function (value) {
  return {
    type: USERNAME,
    value: value
  }
}

const setSignedIn = function (data) {
  return {
      type: USER_SIGNED_IN,
      [USERNAME] : data.username,
      [USER_ID]: data.uid,
  };
};

const setSignedOut = function () {
  return {
      type: USER_SIGNED_OUT
  };
};


export {
    reducer as default,
    initialState as userInitialState,
    updateUsername,
    setSignedIn,
    setSignedOut
};
