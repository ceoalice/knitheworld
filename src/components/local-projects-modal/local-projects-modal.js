import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Modal from '../../containers/modal';
import styles from './local-projects-modal.css';

import ProjectItem from '../../containers/project-item.js';

function lastModified(timestamp) { 
  let created = new Date(timestamp*1000); // convert seconds to milliseconds
  let diff = (new Date()) - created; // milliseconds
  if (diff > 3.154e+10) {
    let month = created.toLocaleString('default', { month: 'short'});
    let year = created.getFullYear();
    return `${month} ${created.getDate()}, ${year}`;
  } else if (diff > 8.64e+7) {
    let month = created.toLocaleString('default', { month: 'short' });
    return `${month} ${created.getDate()}`;
  } else {
    let hour =  diff / 3.6e+6;
    return (hour < 1)
        ? (60*hour < 1) 
          ? `${Math.round(3600*hour)} sec ago`
          : `${Math.round(60*hour)} min ago`
        : `${Math.round(hour)} hours ago`
  }
}

const LocalProjectModalComponent = props => (
  <Modal
      fullScreen
      // className={styles.modalContent}
      contentLabel={"Locally Stored Projects"}
      // headerClassName={styles.header}
      // headerImage={props.connectionSmallIconURL}
      id="localProjectsModal"
      onRequestClose={props.onCancel}
      isRtl={false}
  >
    {props.projects
      ? <div className={classNames(styles.libraryScrollGrid)} >
          {props.projects.map((dataItem, index) => (
              <ProjectItem
                key={index}
                name={dataItem.name}
                xml={dataItem.xml}
                size={dataItem.size}
                description={`Last Edited ${lastModified(dataItem.timestamp.seconds)}`}
                id={dataItem.id}
                iconURL={dataItem.imgData}
                onSelect={()=> props.openProject(dataItem.id)}
                onDelete={()=> props.deleteProject(dataItem.id)}
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