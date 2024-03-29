import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import EditIcon from '@material-ui/icons/Edit';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import EditModal from "./edit-modal.js"
import DownloadModal from "./download-modal.js";

import styles from './project-item.scss';

function projectSize(kilobytes) {
  if (kilobytes > 1e+6) {
    return `${Math.floor(Number(kilobytes/1e+6))} GB`
  } else if (kilobytes > 1e+3) {
    return `${Math.floor(Number(kilobytes/1e+3))} MB`
  } else {
    return `${Number(kilobytes)} KB`
  }
}

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

/* eslint-disable react/prefer-stateless-function */
const ProjectItemComponent = (props) => {  
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDownload, setOpenDownload] = React.useState(false);

  // prevent clicks from triggering on any elements behind modals
  const stopEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleClickDownload = (e) => {
    setOpenDownload(true);
    stopEvent(e);
  }

  const handleCloseDownload = (e) => {
    setOpenDownload(false);
    stopEvent(e);
  }

  const handleClickEdit = (e) => {
    setOpenEdit(true);
    stopEvent(e);
  }
  
  const handleCloseEdit = (e) => {
    setOpenEdit(false);
    stopEvent(e);
  }
  
    return (
        <div className={
          classNames(
            styles.libraryItem,
            styles.featuredItem,
            props.hidden ? styles.hidden : null
          )}
          onClick={props.onClick}
        >
          <div className={styles.featuredImageContainer}>
            <object
              className={styles.featuredImage}
              data={props.iconURL || "/static/images/placeholder-image.png"}
              type="image/png"
            >
              {props.project.name}
            </object>
          </div>

          <div className={styles.featuredText}>
            {
              !props.isExample 
              ? <span className={styles.projectSize}> {projectSize(props.project.size)} </span>
              : null
            }
            <span className={styles.libraryItemName}>{props.project.name}</span> 
            <br />
            <span className={styles.featuredDescription}>
              {!props.isExample 
                ? `Last Edited ${lastModified(props.project.timestamp.seconds)}`
                : null
              }
            </span>
          </div>
          
          {!props.isExample 
              ? (
                <div>
                  <SaveAltIcon
                  onClick={handleClickDownload}
                  className={classNames(styles.icon,styles.save)} 
                  /> 
                  <EditIcon 
                  onClick={handleClickEdit}
                  className={classNames(styles.icon,styles.edit)} 
                  />
                </div>
              ) 
              : null
          }

          {!props.isExample 
              ? (
                <div className={classNames(styles.deleteProjectButton)}>
                  <DeleteForeverIcon
                    fontSize="large"
                    onClick={props.onClickClose}
                  />
                </div>
              ) 
              : null
          }

         {!props.isExample 
           ? (
            <div>
              <EditModal 
                open={openEdit} 
                handleClose={handleCloseEdit} 
                id={props.project.id} 
                name={props.project.name}
              /> 
              <DownloadModal 
                open={openDownload} 
                handleClose={handleCloseDownload} 
                project={props.project}
                imageURL={props.iconURL}
              /> 
            </div>
            )
            : null
         }
  
        </div>
    )

}
/* eslint-enable react/prefer-stateless-function */


ProjectItemComponent.propTypes = {
    disabled: PropTypes.bool,
    extensionId: PropTypes.string,
    hidden: PropTypes.bool,
    iconURL: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Promise)
    ]),
    insetIconURL: PropTypes.string,

    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    isExample : PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    onClickClose: PropTypes.func.isRequired,
};

ProjectItemComponent.defaultProps = {
    disabled: false,
    isExample: false,
    showPlayButton: false
};

export default ProjectItemComponent;