const OPEN_MODAL = 'OPEN_MODAL';
const CLOSE_MODAL = 'CLOSE_MODAL';

const MODAL_SIMULATOR = 'fullscreenSimulator';
const MODAL_IMAGE_IMPORT = 'imageImport';
const MODAL_IMAGE_EXPORT = 'imageExport';
const MODAL_SAMPLE_PROJECTS = 'sampleProjects';
const MODAL_LOCAL_PROJECTS = 'localProjects';
const MODAL_SAVE_AS = 'saveAs';
const MODAL_SHARE_PROJECT = "shareProject";
const MODAL_JOIN = "join";
const MODAL_PASSWORD_RESET = "passwordReset"

const initialState = {
    [MODAL_SIMULATOR]: false, 
    [MODAL_IMAGE_IMPORT]: false,
    [MODAL_IMAGE_EXPORT]: false,
    [MODAL_SAMPLE_PROJECTS]: false,
    [MODAL_LOCAL_PROJECTS]: false,
    [MODAL_SAVE_AS]: false,
    [MODAL_SHARE_PROJECT]: false,
    [MODAL_JOIN] : false,
    [MODAL_PASSWORD_RESET] : false
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

const openImageImport = function () {
  return openModal(MODAL_IMAGE_IMPORT);
};
const closeImageImport = function () {
  return closeModal(MODAL_IMAGE_IMPORT);
};

const openImageExport = function () {
  return openModal(MODAL_IMAGE_EXPORT);
};
const closeImageExport = function () {
  return closeModal(MODAL_IMAGE_EXPORT);
};

const openSampleProjects = function () {
  return openModal(MODAL_SAMPLE_PROJECTS);
};
const closeSampleProjects = function () {
  return closeModal(MODAL_SAMPLE_PROJECTS);
};

const openLocalProjects = function () {
  return openModal(MODAL_LOCAL_PROJECTS);
};
const closeLocalProjects = function () {
  return closeModal(MODAL_LOCAL_PROJECTS);
};

const openSaveAs = function() {
  return openModal(MODAL_SAVE_AS);
}
const closeSaveAs = function() {
  return closeModal(MODAL_SAVE_AS);
}

const openShareProject = function() {
  return openModal(MODAL_SHARE_PROJECT);
}
const closeShareProject = function() {
  return closeModal(MODAL_SHARE_PROJECT);
}

const openJoin = function() {
  return openModal(MODAL_JOIN);
}
const closeJoin = function() {
  return closeModal(MODAL_JOIN);
}

const openPasswordReset = function() {
  return openModal(MODAL_PASSWORD_RESET);
}

const closePasswordReset = function() {
  return closeModal(MODAL_PASSWORD_RESET);
}

export {
    reducer as default,
    initialState as modalsInitialState,
    openFullscreenSimulator,
    closeFullscreenSimulator,
    openImageImport,
    closeImageImport,
    openImageExport,
    closeImageExport,
    openSampleProjects,
    closeSampleProjects,
    openLocalProjects,
    closeLocalProjects,
    openSaveAs,
    closeSaveAs,
    openShareProject,
    closeShareProject,
    openJoin,
    closeJoin,
    openPasswordReset,
    closePasswordReset
};