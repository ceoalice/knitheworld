import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';

import { closeSampleProjects } from '../../../reducers/modals.js';
import { updateProjectName } from '../../../reducers/project-state.js';

import Modal from '../../../containers/modal';
import ProjectItem from '../../../containers/project-item.js';

import ProjectAPI from "../../../lib/project-api.js";

import styles from './modal.scss';

class SampleProjectsModal extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
          projects : null
        } 
        this.openProject = this.openProject.bind(this);
    }

    componentDidMount() {
      this.setState({projects : ProjectAPI.getSampleProjects()});
    }

    openProject(xml) {
      ProjectAPI.newProject(xml);
      this.props.onCancel();
    }

    render () {
      const props = {...this.props};
      return (
        <Modal
          fullScreen
          contentLabel={"Sample Projects"}
          id="sampleProjectsModal"
          onRequestClose={props.onCancel}
        >
          {this.state.projects
            ? <div className={classNames(styles.libraryScrollGrid)}>
                {this.state.projects.map((project, index) => (
                    <ProjectItem
                      isExample
                      project={project}
                      key={index}
                      onSelect={()=> this.openProject(project.xml)}
                      onDelete={()=> {}}
                    />
                  ))}
              </div>
            : null
          }
        </Modal>
      )
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