import React from 'react';
import ReactDOM from 'react-dom';

import ProjectViewComponent from "../components/projects/projects.js";

import ImageAPI from "../lib/image-api.js";

import ProjectsAPI from "../lib/project-api.js";
import UserManager from "../lib/user-manager.js";

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
        username : ''
      }
    }

    async componentDidMount() {
      const { match: { params } } = this.props;
      console.log('ProjectView: ',  params.id);

      let res = await ProjectsAPI.getProject(params.id);

      if ( res.status == 200 ) {
        let res2 = await ImageAPI.getProjectImageURL(res.data.creator, res.data.id);

        if ( res2.status == 200 ) {
              
          console.log(res2.data)
          
          let res3 = await UserManager.getUsernameByID(res.data.creator);

          console.log(res3);
          this.setState({project : res.data, thumbnail : res2.data, username : res3});
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
            />
          : null
        );
    }
};

ReactDOM.render(
  // <React.StrictMode>
  <Router>
    <Route path="/projects/:id" component={ProjectView} />
  </Router>
  // </React.StrictMode>,
,document.getElementById('root'));