import {createStore, combineReducers} from 'redux';

import projectStateReducer from './reducers/project-state.js';
import customProceduresReducer from './reducers/custom-procedures';
import pixelReducer from './reducers/pixels.js';

import modalReducer from './reducers/modals';
import userReducer from './reducers/user.js'

const reducers = combineReducers({
  modals: modalReducer,
  pixels: pixelReducer,
  projectState: projectStateReducer,
  customProcedures: customProceduresReducer,
  user: userReducer
});

export default createStore(reducers);