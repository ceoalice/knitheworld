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
        <div
            className={classNames(styles.libraryScrollGrid)}
        >
              {
                [1,2,3,4,5].map((dataItem, index) => (
                  <ProjectItem
                    key={index}
                    name={`Project ${index}`}
                    description
                    description={`sample project`}
                    id={index}

                    onSelect={()=> {}}
                    onDelete={()=> {}}
                  />
                ))
              }
        </div>
    </Modal>
);

SampleProjectModalComponent.propTypes = {
    onCancel: PropTypes.func.isRequired,
    openProject: PropTypes.func.isRequired,
    deleteProject: PropTypes.func.isRequired,
    projects: PropTypes.array,
};

export {
  SampleProjectModalComponent as default
};