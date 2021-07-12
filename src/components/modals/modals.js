import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

// modals
import LocalProjectsModal from "./local-projects/modal.js";
import ImageImportModal from "./image-import/modal.js";
import SampleProjectsModal from "./sample-projects/modal.js";
import SaveAsModal from "./save-as/modal.js";
import ShareModal from "./share/modal.js";
import JoinModal from "./join/modal.js";
import CustomProcedures from "./custom-procedures/modal.js";

const ModalLayerComponent = props => {
    return (
        <React.Fragment>   
            { props.sampleProjectsVisible 
              ? <SampleProjectsModal />
              : null
            }
            { props.localProjectsVisible 
              ? <LocalProjectsModal vm={props.vm} />
              : null
            }
            { props.imageImportVisible 
              ? <ImageImportModal />
              : null
            }
            { props.saveAsVisible
              ? <SaveAsModal />
              : null
            } 
            { props.shareProjectVisible
              ? <ShareModal />
              : null
            }
            { props.customProceduresVisible
              ? <CustomProcedures />
              : null
            }
            { props.joinVisible
              ? <JoinModal/>
              : null
            } 
        </React.Fragment>
    );
};

ModalLayerComponent.propTypes = {
    vm: PropTypes.object.isRequired,
    imageImportVisible: PropTypes.bool.isRequired,
    imageExportVisible: PropTypes.bool.isRequired,
    sampleProjectsVisible: PropTypes.bool.isRequired,
    localProjectsVisible: PropTypes.bool.isRequired,
    saveAsVisible: PropTypes.bool.isRequired,
    shareProjectVisible: PropTypes.bool.isRequired,
    customProceduresVisible: PropTypes.bool.isRequired,
    joinVisible: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  imageImportVisible: state.modals.imageImport,
  imageExportVisible: state.modals.imageExport,
  sampleProjectsVisible : state.modals.sampleProjects,
  localProjectsVisible : state.modals.localProjects,
  saveAsVisible : state.modals.saveAs,
  shareProjectVisible : state.modals.shareProject,
  customProceduresVisible: state.customProcedures.active,
  joinVisible: state.modals.join,
});

export default connect(mapStateToProps)(ModalLayerComponent);