import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Modal from '../../containers/modal';
import styles from './sample-projects-modal.css';

import ProjectItem from '../../containers/project-item.js';

const SampleProjectModalComponent = props => (
    <Modal
        fullScreen
        // className={styles.modalContent}
        contentLabel={"Sample Projects"}
        // headerClassName={styles.header}
        // headerImage={props.connectionSmallIconURL}
        id="sampleProjectsModal"
        onRequestClose={props.onCancel}
        isRtl={false}
    >
      {props.projects
        ? <div className={classNames(styles.libraryScrollGrid)}>
            {props.projects.map((project, index) => (
                <ProjectItem
                  isExample
                  project={project}
                  key={index}
                  onSelect={()=> props.openProject(project.xml)}
                  onDelete={()=> {}}
                />
              ))}
          </div>
        : null
      }
    </Modal>
);

SampleProjectModalComponent.propTypes = {
    onCancel: PropTypes.func.isRequired,
    openProject: PropTypes.func.isRequired,
    projects: PropTypes.array,
};

export {
  SampleProjectModalComponent as default
};