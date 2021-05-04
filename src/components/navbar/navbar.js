import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import styles from './navbar.css';

const NavBarComponent = props => {
    return (
        <React.Fragment>
            <Toolbar variant="dense" className={styles.topnav}>
                <a href="#" onClick={props.newProject}>
                    New
                  </a>
                  <a href="#" onClick={props.saveProject}>
                    Save
                  </a>
                  <a href="#" onClick={props.uploadCode}>
                    Upload File
                  </a>
                  <a role="button" style={{cursor:'pointer'}} onClick={props.openImageImport}>
                    Upload Image
                  </a>
                  <a role="button" style={{cursor:'pointer'}} onClick={props.openLocalProjects}>
                    My Projects
                  </a>
                  <a role="button" style={{cursor:'pointer'}} onClick={props.openSampleProjects}>
                    Examples
                  </a>
                  <input
                      type="file"
                      className={styles.fileInput}
                      onInput={props.loadCode}
                      ref={props.fileChooser}
                  />
              </Toolbar>
        </React.Fragment>
    );
};

NavBarComponent.propTypes = {

    downloadCode: PropTypes.func.isRequired,
    uploadCode: PropTypes.func.isRequired,
    saveProject: PropTypes.func.isRequired,
    newProject: PropTypes.func.isRequired,
    openImageImport : PropTypes.func.isRequired,
    openImageExport: PropTypes.func.isRequired,
    openSampleProjects: PropTypes.func.isRequired,
    openLocalProjects: PropTypes.func.isRequired
};

export default NavBarComponent;