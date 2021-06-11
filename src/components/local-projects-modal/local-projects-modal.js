import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Modal from '../../containers/modal';
import styles from './local-projects-modal.css';

import ProjectItem from '../../containers/project-item.js';

const LocalProjectModalComponent = props => (
  <Modal
      fullScreen
      // className={styles.modalContent}
      contentLabel={"My Projects"}
      // headerClassName={styles.header}
      // headerImage={props.connectionSmallIconURL}
      id="localProjectsModal"
      onRequestClose={props.onCancel}
      isRtl={false}
  >
    {props.projects
      ? <div className={classNames(styles.libraryScrollGrid)} >
          {props.projects.map((project, index) => (
              <ProjectItem
                key={index}
                project={project}
                onSelect={()=> props.openProject(project.id)}
                onDelete={()=> props.deleteProject(project.id)}
              />
            ))}
        </div>
      : null
    }
  </Modal>
);

LocalProjectModalComponent.propTypes = {
    onCancel: PropTypes.func.isRequired,
    openProject: PropTypes.func.isRequired,
    deleteProject: PropTypes.func.isRequired,
    projects: PropTypes.array
};

export {
  LocalProjectModalComponent as default
};