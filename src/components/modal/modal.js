import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';

import Button from '../button/button.js';
import CloseButton from '../close-button/close-button.js';

import backIcon from '../../lib/assets/icon--back.svg';
import helpIcon from '../../lib/assets/icon--help.svg';

import styles from './modal.scss';

import CircularProgress from '@material-ui/core/CircularProgress';


const ModalComponent = props => (
    <ReactModal
        isOpen
        className={classNames(styles.modalContent, props.className, {
            [styles.fullScreen]: props.fullScreen
        })}
        shouldCloseOnOverlayClick={false}
        contentLabel={props.contentLabel}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onRequestClose}
    >
        <div dir="ltr" className={styles.box}>
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
                      iconSrc={helpIcon}
                      onClick={props.onHelp}
                  >
                      Help
                  </Button>
                  ) : null}
                </div>
                {!props.noHeader ?
                  <div className={classNames(
                      styles.headerItem,
                      styles.headerItemTitle
                  )}
                  >
                    {/* {props.headerImage ? (
                        <img
                            className={styles.headerImage}
                            src={props.headerImage}
                        />
                    ) : null} */}
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
                  {props.fullScreen ? (
                      <Button
                          className={styles.backButton}
                          iconSrc={backIcon}
                          onClick={props.onRequestClose}
                      >
                          Back
                      </Button>
                  ) : (
                      <CloseButton
                          size={CloseButton.SIZE_LARGE}
                          onClick={props.onRequestClose}
                      />
                  )}
                </div>
            </div>
            </div>
            {props.children
              ? props.children
              : <div className={styles.loadIcon}> <CircularProgress /> </div>
            }
        </div>
    </ReactModal>
);

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
    isRtl: PropTypes.bool,
    onHelp: PropTypes.func,
    onRequestClose: PropTypes.func,
    noHeader: PropTypes.bool
};

ModalComponent.defaultProps = {
  noHeader : false,
  isRtl : false
}

export default ModalComponent;
