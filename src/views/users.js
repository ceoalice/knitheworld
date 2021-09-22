import React from 'react';
import ReactDOM from 'react-dom';
import VM from 'scratch-vm';

import {Provider} from 'react-redux';
import store from "../store.js";

import UserViewComponent from "../components/users/users.js";

import {UserAPI, ProjectAPI} from '../lib/api';

import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

class UserView extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      user : null, 
      projects : [],
    }

    this.vm = new VM();
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    // console.log('UserView: ',  params.id);

    let res = await UserAPI.getUserInfo(params.id);

    // console.log({res});

    if ( res.status == 200 ) {

      this.setState({user : res.data });

      let res2 = await ProjectAPI.getProjectsByUserID(params.id);

      if ( res2.status == 200 ) {
        
        
        let projects = res2.data;
        // console.log( { projects });
        this.setState({ projects });
      }
    } else {
      // redirecting to 404 page and letting it know in path that its a 404 for a project
      window.location.assign(`/404?user&id=${params.id}`);
    }
  }

  render () {
      return (
        this.state.user 
        ? <UserViewComponent 
            projects={this.state.projects} 
            user={this.state.user}
            vm={this.vm}
          />
        : null
      );
  }
};

ReactDOM.render(
 // <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Route path="/users/:id" component={UserView}/>
      </Router>
    </Provider>
 // </React.StrictMode>,
,document.getElementById('root'));