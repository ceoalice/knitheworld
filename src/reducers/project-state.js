const PROJECT_RUN_STATE = 'projectRunState';
const UPDATE_PROJECT_NAME = "changeProjectName";
const PROJECT_SAVED = "projectSaved";
const PROJECT_LOADING = "projectLoading";

const initialState = {
    [PROJECT_RUN_STATE]: false,
    [PROJECT_SAVED]: true,
    [PROJECT_LOADING]: false,
    currentProjectName: "Unsaved Project"
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;

    switch (action.type) {
    case PROJECT_RUN_STATE:
        return Object.assign({}, state, {
            projectRunState: action.state
        });
    case UPDATE_PROJECT_NAME:
        return Object.assign({}, state, {
          currentProjectName: action.value
        });
    case PROJECT_SAVED:
      return Object.assign({}, state, {
        [PROJECT_SAVED]: action.value
      });
    case PROJECT_LOADING:
      return Object.assign({}, state, {
        [PROJECT_LOADING]: action.value
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

const updateProjectName = function (value) {
  // console.log("NEW PROJECT NAME", value);
  return {
    type: UPDATE_PROJECT_NAME,
    value: value
  }
}

// toggles boolean determining if project needs to be saved or not
const setProjectSaved = function (value) {
  console.log(value ? "PROJECT SAVED" : "NEEDS SAVING");
  return {
      type: PROJECT_SAVED,
      value: value
  };
};

const toggleProjectLoading = function (value) {
  return {
      type: PROJECT_LOADING,
      value: value
  };
};



export {
    reducer as default,
    initialState as projectRunInitialState,
    setProjectRunState,
    updateProjectName,
    toggleProjectLoading,
    setProjectSaved
};
