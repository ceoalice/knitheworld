import React from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import VM from 'scratch-vm';

import styles from './navbar.scss';
import { ReactComponent as KnitheworldLogo} from '../../lib/assets/knitheworld-logo.svg';
import Account from "../account/account"

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
              <div className={styles.topnavLeft}>
                <KnitheworldLogo className={styles.logo} />
                <a role="button" style={{cursor:'pointer'}} onClick={props.newProject}>
                  New
                </a>
                <a role="button" style={{cursor:'pointer'}} onClick={props.saveProject}>
                  Save
                </a>
                <a role="button" style={{cursor:'pointer'}} onClick={handleClick}>
                  Upload
                </a>
                <a role="button" style={{cursor:'pointer'}} onClick={props.openLocalProjects}>
                  My Projects
                </a>
                <a role="button" style={{cursor:'pointer'}} onClick={props.openSampleProjects}>
                  Examples
                </a>
                <a role="button" style={{cursor:'pointer'}} onClick={props.openShareProject}>
                  Share
                </a>
                <input
                    type="file"
                    className={styles.fileInput}
                    onChange={props.loadCode}
                    ref={props.fileChooser}
                />
              </div>

              <Account vm={props.vm}/>

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
    vm: PropTypes.instanceOf(VM).isRequired,
    uploadCode: PropTypes.func.isRequired,
    saveProject: PropTypes.func.isRequired,
    newProject: PropTypes.func.isRequired,
    openImageImport : PropTypes.func.isRequired,
    openImageExport: PropTypes.func.isRequired,
    openSampleProjects: PropTypes.func.isRequired,
    openLocalProjects: PropTypes.func.isRequired,
    openShareProject: PropTypes.func.isRequired,
    openJoin: PropTypes.func.isRequired
};

export default NavBarComponent;