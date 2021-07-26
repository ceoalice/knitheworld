import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import modalReducer from './reducers/modals';
import pixelReducer from './reducers/pixels.js';
import projectStateReducer from './reducers/project-state.js';
import customProceduresReducer from './reducers/custom-procedures.js'
import userReducer from './reducers/user.js'

import GUI from './views/gui.js';
import ProjectPage from './views/project.js';
import UserPage from './views/user.js';

import {setAppElement} from "react-modal";
setAppElement(document.getElementById('root'));

const reducers = combineReducers({
    modals: modalReducer,
    pixels: pixelReducer,
    projectState: projectStateReducer,
    customProcedures: customProceduresReducer,
    user: userReducer
});
const store = createStore(reducers);

ReactDOM.render(
    // <React.StrictMode>
        <Provider store={store}>
            <GUI />
        </Provider>
    // </React.StrictMode>,
    ,
    document.getElementById('root')
);
