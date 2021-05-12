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
        this.vm = props.vm;
        this.openProject = this.openProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.handleProjectsUpdate = this.handleProjectsUpdate.bind(this);
    }

    componentDidMount() {
      let projects = ProjectManager.getProjects();

      projects.sort((a,b) => (new Date(b.timestamp)) - (new Date(a.timestamp)));
      
      // console.log("projects: ", projects)
      this.setState({projects});

      this.vm.on('PROJECT_NAME_CHANGED', this.handleProjectsUpdate);
    }

    componentWillUnmount() {
      this.vm.removeListener('PROJECT_NAME_CHANGED', this.handleProjectsUpdate);
    }

    handleProjectsUpdate() {
      // console.log("GOT HERE: handleProjectsUpdate");
      let projects = ProjectManager.getProjects();
      projects.sort((a,b) => (new Date(b.timestamp)) - (new Date(a.timestamp)));
      this.setState({projects});
    }

    openProject(id) {
      ProjectManager.loadProject(id);
      this.props.updateProjectName(ProjectManager.getCurrentProjectName());
      this.props.onCancel();
    }


    deleteProject(id) {
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