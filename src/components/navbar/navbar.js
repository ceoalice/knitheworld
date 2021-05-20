import React from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import styles from './navbar.css';
import { ReactComponent as KnitheworldLogo} from './knitheworld-logo.svg';

const NavBarComponent = props => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

    return (
        <React.Fragment>
            <Toolbar disableGutters variant="dense" className={styles.topnav}>
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
                  <a role="button" style={{cursor:'pointer'}} onClick={handleClick}>
                    Upload
                  </a>
                  {/* <a href="#" onClick={props.uploadCode}>
                    Upload File
                  </a>
                  <a role="button" style={{cursor:'pointer'}} onClick={props.openImageImport}>
                    Upload Image
                  </a> */}
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
              <Menu
                id="upload-menu"
                anchorEl={anchorEl}
                keepMounted
                // disableAutoFocusItem
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { props.uploadCode(); handleClose(); }}> File </MenuItem>
                <MenuItem onClick={() => { props.openImageImport(); handleClose(); }}> Image </MenuItem>
              </Menu>
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