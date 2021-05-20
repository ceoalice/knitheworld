import React from 'react';
import SampleProjectsModalComponent from '../components/sample-projects-modal/sample-projects-modal.js';
import { closeSampleProjects } from '../reducers/modals.js';
import { updateProjectName } from '../reducers/project-state.js';

import {connect} from 'react-redux';

import ProjectManager from "../lib/project-manager.js"

class SampleProjectsModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
          projects : null
        } 
        this.openProject = this.openProject.bind(this);
    }

    componentDidMount() {
      this.setState({projects : ProjectManager.getSampleProjects()});
    }

    openProject(xml) {
      ProjectManager.newProject(xml);
      this.props.onCancel();
    }

    render () {
        return (
            <SampleProjectsModalComponent
                onCancel={this.props.onCancel}
                projects={this.state.projects}
                openProject={this.openProject}
            />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onCancel: () => dispatch(closeSampleProjects()),
    updateProjectName : (value) => dispatch(updateProjectName(value))
});

export default connect(
    null,
    mapDispatchToProps
)(SampleProjectsModal);