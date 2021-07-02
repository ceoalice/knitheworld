import React from 'react';
import LocalProjectsModalComponent from '../components/local-projects-modal/local-projects-modal.js';
import { closeLocalProjects } from '../reducers/modals.js';

import {connect} from 'react-redux';


import ProjectManager from "../lib/project-manager.js"

class LocalProjectsModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
          projects : null
        } 
        this.vm = props.vm;
        this.openProject = this.openProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.handleProjectsUpdate = this.handleProjectsUpdate.bind(this);
        // this.closeModal = this.closeModal.bind(this);
    }

    async componentDidMount() {
      this.handleProjectsUpdate();
      this.vm.on('PROJECT_NAME_CHANGED', this.handleProjectsUpdate);
    }

    componentWillUnmount() {
      this.vm.removeListener('PROJECT_NAME_CHANGED', this.handleProjectsUpdate);
    }

    async handleProjectsUpdate() {
      let projects = await ProjectManager.getProjects();
      this.setState({projects});
    }

    openProject(id) {
      this.props.onCancel();
      ProjectManager.loadProject(id);
    }

    deleteProject(id) {
      ProjectManager.deleteProject(id).then(()=> {
        this.handleProjectsUpdate();
      });
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
});

export default connect(
    null,
    mapDispatchToProps
)(LocalProjectsModal);