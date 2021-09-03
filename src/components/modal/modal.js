import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-modal';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import HelpIcon from '@material-ui/icons/Help';

import styles from './modal.scss';

const ModalComponent = props => {
  return (
    <Modal 
        isOpen
        className={classNames(styles.modal, props.className, {
            [styles.fullScreen]: props.fullScreen
        })}
        shouldCloseOnOverlayClick={props.closeOnOverlayClick}
        contentLabel={props.contentLabel}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onRequestClose}
    >
        <div
        dir= {props.dir}
        className={styles.box}>
            <div className={props.noHeader ? styles.noHeader : styles.header}>
            <div className={classNames(styles.headerContents, props.headerClassName)}>
                <div
                    className={classNames(
                        styles.headerButton,
                    )}
                >
                  {props.onHelp ? (
                    <Button
                      className={styles.helpButton}
                      onClick={props.onHelp}
                    >
                      <HelpIcon /> 
                      <div style={{textTransform: "none"}}> Help </div>
                    </Button>
                  ) : null}
                </div>
                {!props.noHeader ?
                  <div className={classNames(
                      styles.headerItem,
                      styles.headerItemTitle
                  )}
                  >
                    {props.contentLabel}
                  </div>
                  : null
                }

                <div className={classNames(
                  styles.headerButton,
                  {
                    [styles.rightHeaderButton] : !props.fullScreen
                  } 
                )}
                >
                  {props.noExit 
                    ? null
                    : props.fullScreen ? (    
                        <Button
                          className={classNames(styles.backButton)}
                          onClick={props.onRequestClose}
                        >
                            <ArrowBackIcon style={{color:'white'}}/> 
                            <div style={{textTransform: "none"}}> Back </div>
                        </Button>
                
                      ) : (
                        <IconButton 
                          size='small'
                          onClick={props.onRequestClose}
                          className={styles.closeButton}
                        >
                          <CloseIcon/>
                        </IconButton>
                      )
                    }
                </div>
            </div>
            </div>
            {props.children
              ? props.children
              : <div className={styles.loadIcon}> <CircularProgress /> </div>
            }
        </div>
    </Modal>
)};

ModalComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    contentLabel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    fullScreen: PropTypes.bool,
    headerClassName: PropTypes.string,
    headerImage: PropTypes.string,
    onHelp: PropTypes.func,
    onRequestClose: PropTypes.func,
    noHeader: PropTypes.bool,
    noExit: PropTypes.bool,
    closeOnOverlayClick : PropTypes.bool,
};

ModalComponent.defaultProps = {
  noHeader : false,
  noExit : false,
  dir : 'ltr',
  fullScreen: false,
  closeOnOverlayClick : false,
}

export default ModalComponent;