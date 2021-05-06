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
                props.projects.map((dataItem, index) => (
                  <ProjectItem
                    isExample
                    key={index}
                    name={dataItem.name}  
                    id={dataItem.id}
                    iconURL={dataItem.imgData}
                    onSelect={()=> props.openProject(dataItem.xml)}
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
    projects: PropTypes.array.isRequired,
};

export {
  SampleProjectModalComponent as default
};