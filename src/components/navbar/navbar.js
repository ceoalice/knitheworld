import React from 'react';
import PropTypes from 'prop-types';

import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { withRouter } from "react-router-dom";

import styles from './navbar.scss';
import { ReactComponent as KnitheworldLogo} from './knitheworld-logo.svg';
import Account from "../account/account"

const NavBarComponent = props => {
  const [anchorEl, setAnchorEl] = React.useState({
    save : null,
    upload: null
  });

  const { match } = props;
  const isGUI = (match && match.path == "/gui");

  const handleClick = (event) => {
    setAnchorEl({ ...anchorEl, [event.currentTarget.name]: event.currentTarget });
  };

  const handleClose = (el) => {
    setAnchorEl({ ...anchorEl, [el]: null });
  };
  
  const {save, upload} = anchorEl;
    return (
        <React.Fragment>
            <Toolbar disableGutters variant="dense" className={styles.topnav}>
              <div className={styles.topnavLeft}>
                <KnitheworldLogo onClick={props.goToHomePage} className={styles.logo} />

                { isGUI 
                ? <div>
                    <button onClick={props.newProject}>
                      New
                    </button>
                    <button name="save" onClick={handleClick}>
                      Save
                    </button>
                    <button name="upload" onClick={handleClick}>
                      Upload
                    </button>
                    <button onClick={props.openSampleProjects}>
                      Examples
                    </button>
                  </div>
                : null
                }

                { props.signedIn && isGUI
                ? <button onClick={props.openShareProject}>
                  Share
                </button>
                : null
                }
                
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
                anchorEl={upload}
                keepMounted
                // disableAutoFocusItem
                open={Boolean(upload)}
                onClose={()=> handleClose('upload')}
              >
                <MenuItem onClick={() => { props.uploadCode(); handleClose('upload'); }}> File </MenuItem>
                <MenuItem onClick={() => { props.openImageImport(); handleClose('upload'); }}> Image </MenuItem>
              </Menu>

              <Menu
                id="save-menu"
                anchorEl={save}
                keepMounted
                open={Boolean(save)}
                onClose={()=> handleClose('save')}
              >
                {props.signedIn 
                ? <MenuItem onClick={() => { props.saveProject(); handleClose('save'); }}> Save now </MenuItem>
                : null
                } 
                {props.signedIn
                ? <MenuItem onClick={() => { props.saveAsCopy(); handleClose('save'); }}> Save as copy </MenuItem>
                : null
                }
                <MenuItem onClick={() => { props.downloadCode(); handleClose('save'); }}> Save to computer </MenuItem>
              </Menu>
              </Toolbar>
        </React.Fragment>
    );
};

NavBarComponent.propTypes = {
    vm: PropTypes.object,
    uploadCode: PropTypes.func.isRequired,
    downloadCode: PropTypes.func.isRequired,
    saveProject: PropTypes.func.isRequired,
    saveAsCopy: PropTypes.func.isRequired,
    newProject: PropTypes.func.isRequired,
    openImageImport : PropTypes.func.isRequired,
    openImageExport: PropTypes.func.isRequired,
    openSampleProjects: PropTypes.func.isRequired,
    openLocalProjects: PropTypes.func.isRequired,
    openShareProject: PropTypes.func.isRequired,
    openJoin: PropTypes.func.isRequired,
    goToHomePage : PropTypes.func.isRequired
};

export default withRouter(NavBarComponent);