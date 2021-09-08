import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import { withRouter } from "react-router-dom";

import { closeLocalProjects } from '../../../reducers/modals.js';

import ProjectAPI from "../../../lib/project-api.js";
import ImageAPI from "../../../lib/image-api.js"

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
    }

    async componentDidMount() {
      this.handleProjectsUpdate();
      if (this.vm) {
        this.vm.on('PROJECT_NAME_CHANGED', this.handleProjectsUpdate);
      }
    }

    componentWillUnmount() {
      if (this.vm) {
        this.vm.removeListener('PROJECT_NAME_CHANGED', this.handleProjectsUpdate);
      }
    }

    async handleProjectsUpdate() {
      return ProjectAPI.getProjectsByUserID(ProjectAPI.getUserID())
        .then(res => {
          let projects = res.data;
          console.log({projects});
          this.setState({projects});
        });
    }

    openProject(id) { 
      const { match } = { ...this.props };

      if (match.path == "/gui") {
        this.props.onCancel();
        ProjectAPI.loadProject(id);
      } else {
        window.location.assign(`/gui?projectID=${id}`);
      }
    }

    deleteProject(id) {
      ProjectAPI.deleteProject(id).then(()=> {
        ImageAPI.deleteProjectImage(id).then( () => {
          this.handleProjectsUpdate();
        });
      });
    }

    render () {
        const props = {...this.props};

        return (
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
)(withRouter(LocalProjectsModal));