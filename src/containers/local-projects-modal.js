import React from 'react';
import LocalProjectsModalComponent from '../components/local-projects-modal/local-projects-modal.js';
import { closeLocalProjects } from '../reducers/modals.js';
import { updateProjectName } from '../reducers/project-state.js';

import {connect} from 'react-redux';


import ProjectManager from "../lib/project-manager.js"

class LocalProjectsModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
          projects : []
        } 
        this.openProject = this.openProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
    }

    componentDidMount() {
      // console.log(ProjectManager.getProjectIDs());
      let ids = ProjectManager.getProjectIDs();
      let projects = ProjectManager.getProjects();

      projects.sort((a,b) => (new Date(b.timestamp)) - (new Date(a.timestamp)));

      console.log("IDs: ", ids);
      console.log("projects: ", projects)
      this.setState({projects});
    }

    openProject(id) {
      console.log("GOT HERE: openProject")
      ProjectManager.loadProject(id);
      this.props.updateProjectName(ProjectManager.getCurrentProjectName());
      this.props.onCancel();
    }


    deleteProject(id) {
      console.log("GOT HERE: deleteProject")
      ProjectManager.deleteProject(id);
      let projects = ProjectManager.getProjects();
      projects.sort((a,b) => (new Date(b.timestamp)) - (new Date(a.timestamp)));
      this.setState({projects});
    }

    render () {
        return (
            <LocalProjectsModalComponent
                onCancel={this.props.onCancel}
                projects={this.state.projects}
                openProject={this.openProject}
                deleteProject={this.deleteProject}
            />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onCancel: () => dispatch(closeLocalProjects()),
    updateProjectName : (value) => dispatch(updateProjectName(value))
});

export default connect(
    null,
    mapDispatchToProps
)(LocalProjectsModal);