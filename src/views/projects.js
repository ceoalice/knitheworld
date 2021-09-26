import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import store from "../store.js";

import ProjectViewComponent from "../components/projects/projects.js";

import {ImageAPI, ProjectAPI, UserAPI} from "../lib/api";

import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";


class ProjectView extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        project : null,
        thumbnail : '',
        username : '',
        uid : ''
      }
    }

    async componentDidMount() {
      const { match: { params } } = this.props;

      let res = await ProjectAPI.getProject(params.id);

      if ( res.status == 200 ) {
        this.setState({ project : res.data });

        let res2 = await ImageAPI.getProjectImageURL(res.data.creator, res.data.id);
        if ( res2.status == 200 ) {  
          this.setState({ thumbnail : res2.data });
        }

        let res3 = await UserAPI.getUserInfo(res.data.creator);
        if (res3.status == 200) {
          this.setState({ uid : res3.data.id, username : res3.data.username});
        }

      } else {
        // redirecting to 404 page and letting it know in path that its a 404 for a project
        window.location.assign(`/404?project&id=${params.id}`);
      }
    }

    render () {
        return (
          this.state.project 
          ? <ProjectViewComponent 
              project={this.state.project} 
              thumbnail={this.state.thumbnail}
              username={this.state.username}
              uid={this.state.uid}
            />
          : null
        );
    }
};

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router>
      <Route path="/projects/:id" component={ProjectView} />
    </Router>
  </Provider>
  // </React.StrictMode>,
,document.getElementById('root'));