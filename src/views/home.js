import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import store from "../store.js";

import HomeView from "../components/home/home"

import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";


ReactDOM.render(
    // <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Route path="*" component={HomeView}/>
      </Router>
    </Provider>
    // </React.StrictMode>,
    ,
    document.getElementById('root'));