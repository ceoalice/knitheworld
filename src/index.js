import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import modalReducer from './reducers/modals';
import pixelReducer from './reducers/pixels.js';
import projectStateReducer from './reducers/project-state.js';
import customProceduresReducer from './reducers/custom-procedures.js'
import userReducer from './reducers/user.js'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import GUI from './views/gui.js';
import ProjectView from './views/project-view.js';
import UserPage from './views/user-view.js';

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
          <Router>
            <Switch>
              <Route path="/users/:id">
                <div> USER PAGE </div>
              </Route>
              <Route path="/projects/:id">
                <ProjectView />
              </Route>
              <Route path="/gui"> 
                <GUI/>
              </Route>
              <Route path="/">
                <div> HOME PAGE </div>
              </Route>
            </Switch>
          </Router>
        </Provider>
    // </React.StrictMode>,
    ,
    document.getElementById('root')
);