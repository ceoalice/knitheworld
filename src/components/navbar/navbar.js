import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import styles from './navbar.css';

import { ReactComponent as KnitheworldLogo} from './knitheworld-logo.svg';

const NavBarComponent = props => {
    return (
        <React.Fragment>
            <Toolbar variant="dense" className={styles.topnav}>
              <div>
                <KnitheworldLogo className={styles.logo} />
              </div>
              <div>
                  <a href="#" onClick={props.newProject}>
                    New
                  </a>
                  <a role="button" style={{cursor:'pointer'}} onClick={props.openSaveAs}>
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
              </div>
              </Toolbar>
        </React.Fragment>
    );
};

NavBarComponent.propTypes = {

    downloadCode: PropTypes.func.isRequired,
    uploadCode: PropTypes.func.isRequired,
    // saveProject: PropTypes.func,
    openSaveAs: PropTypes.func.isRequired,
    newProject: PropTypes.func.isRequired,
    openImageImport : PropTypes.func.isRequired,
    openImageExport: PropTypes.func.isRequired,
    openSampleProjects: PropTypes.func.isRequired,
    openLocalProjects: PropTypes.func.isRequired
};

export default NavBarComponent;