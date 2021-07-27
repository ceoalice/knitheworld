import React from 'react';
import { withRouter } from 'react-router-dom';

import ProjectViewComponent from "../components/project-view/project-view.js";

import ImageManager from "../lib/image-manager.js";
import ProjectManager from "../lib/project-manager.js";

class ProjectView extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        thumbnail : '',
        creator : '',
        lastEdited : '',
        description : ''
      }
    }

    componentDidMount() {
      const id = this.props.match.params.id;
      console.log('ProjectView: ',  this.props.match.params.id);

      ProjectManager.getProject(id).then(res => {
        console.log({res})
      })
      // ImageManager.getProjectImageURL(id).then((url) => {
      //   if (url != 404) {
      //     console.log(id,url);
      //   }
      // });
    }

    render () {
        return (
            <ProjectViewComponent />
        );
    }
};

export default withRouter(ProjectView);

