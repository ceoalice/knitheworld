import {bindAll} from 'lodash';
// import defaultsDeep from 'lodash.defaultsdeep';
import PropTypes from 'prop-types';
import React from 'react';
import ScratchBlocks from 'scratch-blocks';
import {connect} from 'react-redux';

// import CustomProceduresComponent from '../components/custom-procedures/custom-procedures.js';

import VMScratchBlocks from '../../../lib/blocks.js';
import {deactivateCustomProcedures} from "../../../reducers/custom-procedures.js";
import Modal from '../../../containers/modal.js';

import booleanInputIcon from './icon--boolean-input.svg';
import textInputIcon from './icon--text-input.svg';
import colorInputIcon from "./icon--color-input.svg";
import labelIcon from './icon--label.svg';

import styles from './modal.scss';

// const messages = {
//     myblockModalTitle: {
//         defaultMessage: 'Make a Block',
//         description: 'Title for the modal where you create a custom block.',
//         id: 'gui.customProcedures.myblockModalTitle'
//     }
// };


class CustomProcedures extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleAddLabel',
            'handleAddBoolean',
            'handleAddTextNumber',
            'handleAddColor',
            'handleToggleWarp',
            'handleCancel',
            'handleOk',
            'setBlocks',
            'onRequestClose'
        ]);
        this.state = {
            rtlOffset: 0,
            warp: false
        };
    }
    componentWillUnmount () {
        if (this.workspace) {
            this.workspace.dispose();
        }
    }
    setBlocks (blocksRef) {
        if (!blocksRef) return;
        this.blocks = blocksRef;
        const workspaceConfig = CustomProcedures.defaultOptions;

        // @todo This is a hack to make there be no toolbox.
        const oldDefaultToolbox = ScratchBlocks.Blocks.defaultToolbox;
        ScratchBlocks.Blocks.defaultToolbox = null;
        this.workspace = ScratchBlocks.inject(this.blocks, workspaceConfig);
        ScratchBlocks.Blocks.defaultToolbox = oldDefaultToolbox;

        // Create the procedure declaration block for editing the mutation.
        this.mutationRoot = this.workspace.newBlock('procedures_declaration');
        // Make the declaration immovable, undeletable and have no context menu
        this.mutationRoot.setMovable(false);
        this.mutationRoot.setDeletable(false);
        this.mutationRoot.contextMenu = false;

        this.workspace.addChangeListener(() => {
            this.mutationRoot.onChangeFn();
            // Keep the block centered on the workspace
            const metrics = this.workspace.getMetrics();
            const {x, y} = this.mutationRoot.getRelativeToSurfaceXY();
            const dy = (metrics.viewHeight / 2) - (this.mutationRoot.height / 2) - y;
            let dx;
            if (this.props.isRtl) {
                // // TODO: https://github.com/LLK/scratch-gui/issues/2838
                // This is temporary until we can figure out what's going on width
                // block positioning on the workspace for RTL.
                // Workspace is always origin top-left, with x increasing to the right
                // Calculate initial starting offset and save it, every other move
                // has to take the original offset into account.
                // Calculate a new left postion based on new width
                // Convert current x position into LTR (mirror) x position (uses original offset)
                // Use the difference between ltrX and mirrorX as the amount to move
                const ltrX = ((metrics.viewWidth / 2) - (this.mutationRoot.width / 2) + 25);
                const mirrorX = x - ((x - this.state.rtlOffset) * 2);
                if (mirrorX === ltrX) {
                    return;
                }
                dx = mirrorX - ltrX;
                const midPoint = metrics.viewWidth / 2;
                if (x === 0) {
                    // if it's the first time positioning, it should always move right
                    if (this.mutationRoot.width < midPoint) {
                        dx = ltrX;
                    } else if (this.mutationRoot.width < metrics.viewWidth) {
                        dx = midPoint - ((metrics.viewWidth - this.mutationRoot.width) / 2);
                    } else {
                        dx = midPoint + (this.mutationRoot.width - metrics.viewWidth);
                    }
                    this.mutationRoot.moveBy(dx, dy);
                    this.setState({rtlOffset: this.mutationRoot.getRelativeToSurfaceXY().x});
                    return;
                }
                if (this.mutationRoot.width > metrics.viewWidth) {
                    dx = dx + this.mutationRoot.width - metrics.viewWidth;
                }
            } else {
                dx = (metrics.viewWidth / 2) - (this.mutationRoot.width / 2) - x;
                // If the procedure declaration is wider than the view width,
                // keep the right-hand side of the procedure in view.
                if (this.mutationRoot.width > metrics.viewWidth) {
                    dx = metrics.viewWidth - this.mutationRoot.width - x;
                }
            }
            this.mutationRoot.moveBy(dx, dy);
        });
        this.mutationRoot.domToMutation(this.props.mutator);
        this.mutationRoot.initSvg();
        this.mutationRoot.render();
        this.setState({warp: this.mutationRoot.getWarp()});
        // Allow the initial events to run to position this block, then focus.
        setTimeout(() => {
            this.mutationRoot.focusLastEditor_();
        });
    }
    handleCancel () {
        this.onRequestClose();
    }
    handleOk () {
        const newMutation = this.mutationRoot ? this.mutationRoot.mutationToDom(true) : null;
        this.onRequestClose(newMutation);
    }
    handleAddLabel () {
        if (this.mutationRoot) {
            this.mutationRoot.addLabelExternal();
        }
    }
    handleAddBoolean () {
        if (this.mutationRoot) {
            this.mutationRoot.addBooleanExternal();
        }
    }
    handleAddTextNumber () {
        if (this.mutationRoot) {
            this.mutationRoot.addStringNumberExternal();
        }
    }
    handleAddColor () {
      if (this.mutationRoot) {
          this.mutationRoot.addColorExternal();
      }
    }
    handleToggleWarp () {
        if (this.mutationRoot) {
            const newWarp = !this.mutationRoot.getWarp();
            this.mutationRoot.setWarp(newWarp);
            this.setState({warp: newWarp});
        }
    }
    onRequestClose(data){
      this.props.onRequestCloseCustomProcedures(data);
      const ws = VMScratchBlocks.getWorkspace();
      ws.refreshToolboxSelection_();
      ws.toolbox_.scrollToCategoryById('myBlocks');
    }
    render () {
        const props = { 
          // warp: this.state.warp,
          // componentRef: this.setBlocks,
          // onAddBoolean: this.handleAddBoolean,
          // onAddLabel: this.handleAddLabel,
          // onAddTextNumber: this.handleAddTextNumber,
          // onAddColor: this.handleAddColor,
          // onCancel: this.handleCancel,
          // onOk: this.handleOk,
          // onToggleWarp: this.handleToggleWarp,
          ...this.props
        };
        return (
          <Modal
              id={"customProceduresModal"}
              className={styles.modalContent}
              contentLabel={'Make a Block'}
              onRequestClose={this.handleCancel}
          >
              <div
                  className={styles.workspace}
                  ref={this.setBlocks}
              />
              <div className={styles.body}>
                  <div className={styles.optionsRow}>
                      <div
                          className={styles.optionCard}
                          role="button"
                          tabIndex="0"
                          onClick={this.handleAddTextNumber}
                      >
                          <img
                              className={styles.optionIcon}
                              src={textInputIcon}
                          />
                          <div className={styles.optionTitle}>
                            Add an input
                          </div>
                          <div className={styles.optionDescription}>
                            number or text
                          </div>
                      </div>
                      <div
                          className={styles.optionCard}
                          role="button"
                          tabIndex="0"
                          onClick={this.handleAddColor}
                      >
                          <img
                              className={styles.optionIcon}
                              src={colorInputIcon}
                          />
                          <div className={styles.optionTitle}>
                            Add an input
                          </div>
                          <div className={styles.optionDescription}>
                            color
                          </div>
                      </div>
                      <div
                          className={styles.optionCard}
                          role="button"
                          tabIndex="0"
                          onClick={this.handleAddBoolean}
                      >
                          <img
                              className={styles.optionIcon}
                              src={booleanInputIcon}
                          />
                          <div className={styles.optionTitle}>
                            Add an input
                          </div>
                          <div className={styles.optionDescription}>
                            boolean
                          </div>
                      </div>
                      <div
                          className={styles.optionCard}
                          role="button"
                          tabIndex="0"
                          onClick={this.handleAddLabel}
                      >
                          <img
                              className={styles.optionIcon}
                              src={labelIcon}
                          />
                          <div className={styles.optionTitle}>
                            Add a label
                              {/* <FormattedMessage
                                  defaultMessage="Add a label"
                                  description="Label for button to add a label"
                                  id="gui.customProcedures.addALabel"
                              /> */}
                          </div>
                      </div>
                  </div>
                  <div className={styles.checkboxRow}>
                      <label>
                          <input
                              checked={this.state.warp}
                              type="checkbox"
                              onChange={this.handleToggleWarp}
                          /> 
                          Run without screen refresh
                      </label>
                  </div>
                  <div className={styles.buttonRow}>
                      <button
                          className={styles.cancelButton}
                          onClick={this.handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                          className={styles.okButton}
                          onClick={this.handleOk}
                      >
                        OK
                      </button>
                  </div>
              </div>
          </Modal>
        );
    }
}

CustomProcedures.propTypes = {
    isRtl: PropTypes.bool,
    mutator: PropTypes.instanceOf(Element),
    options: PropTypes.shape({
        media: PropTypes.string,
        zoom: PropTypes.shape({
            controls: PropTypes.bool,
            wheel: PropTypes.bool,
            startScale: PropTypes.number
        }),
        comments: PropTypes.bool,
        collapse: PropTypes.bool
    })
};

CustomProcedures.defaultOptions = {
    zoom: {
        controls: false,
        wheel: false,
        startScale: 0.9
    },
    media: window.location.pathname == '/knitheworld/'  
      ? `${window.location.pathname}static/blocks-media/`
      : '/static/blocks-media/',
    comments: false,
    collapse: false,
    scrollbars: true
};

CustomProcedures.defaultProps = {
    options: CustomProcedures.defaultOptions
};

const mapStateToProps = state => ({
    isRtl: false,
    mutator: state.customProcedures.mutator
});

const mapDispatchToProps = dispatch => ({    
  onRequestCloseCustomProcedures: data => {
    dispatch(deactivateCustomProcedures(data));
  },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomProcedures);
