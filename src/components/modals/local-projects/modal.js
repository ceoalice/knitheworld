import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';

import { closeLocalProjects } from '../../../reducers/modals.js';

import ProjectManager from "../../../lib/project-manager.js";

import Modal from '../../../containers/modal';
import ProjectItem from '../../../containers/project-item.js';

import styles from './modal.scss';

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
        const props = {...this.props};

        return (
            // <LocalProjectsModalComponent
            //     onCancel={this.props.onCancel}
            //     projects={this.state.projects}
            //     openProject={this.openProject}
            //     deleteProject={this.deleteProject}
            // />
            <Modal
              fullScreen
              contentLabel={"My Projects"}
              id="localProjectsModal"
              onRequestClose={props.onCancel}
            >
              {this.state.projects
                ? <div className={classNames(styles.libraryScrollGrid)} >
                    {this.state.projects.map((project, index) => (
                        <ProjectItem
                          key={index}
                          project={project}
                          onSelect={()=> this.openProject(project.id)}
                          onDelete={()=> this.deleteProject(project.id)}
                        />
                      ))}
                  </div>
                : null
              }
            </Modal>
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