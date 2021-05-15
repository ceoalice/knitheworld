import React from 'react';
import {connect} from 'react-redux';

import {
    downloadThePixels,
    downloadTheCode,
    clearThePixels,
    downloadTheStitches
} from '../reducers/pixels.js';

import {
  openImageExport
} from '../reducers/modals.js'

import VMScratchBlocks from '../lib/blocks.js';
import ProjectManager from '../lib/project-manager.js'

import DownloadButtonComponent from '../components/knit-buttons/download-button.js';

class DownloadButton extends React.Component {
    constructor(props) {
        super(props);
        this.fileChooser = React.createRef();
        this.uploadCode = this.uploadCode.bind(this);
        this.loadCode = this.loadCode.bind(this);
    }

    componentDidUpdate () {
    }

    downloadCode () {
        let xml = ProjectManager.getXML();
        console.log("downloading code");
        // console.log(VMScratchBlocks.getXML());
        var xmlFile = new Blob([xml], { type: "application/xml;charset=utf-8" });
        // console.log(xmlFile)
        var a = document.createElement('a');
        a.href = URL.createObjectURL(xmlFile);
        a.download = 'My Project' + '.xml';
        a.click();
    }

    uploadCode () {
        console.log(this.fileChooser);
        this.fileChooser.current.click();
    }

    loadCode (event) {
        var projectName = event.target.files[0].name.split('.xml')[0];
        if (event.target.files) {
            var reader = new FileReader();
            reader.onload = function(e) {
                console.log(e.target.result);
                VMScratchBlocks.loadXML(e.target.result);

                // document.getElementById('project-name-input').value = projectName;
            }
            reader.readAsBinaryString(event.target.files[0]);
        }
    }

    render() {
        return (
            <DownloadButtonComponent
                downloadCode = {this.downloadCode}
                uploadCode = {this.uploadCode}
                fileChooser = {this.fileChooser}
                loadCode = {this.loadCode}
                {...this.props} />
        );
    }
}

const mapStateToProps = state => ({
    pixelType: state.pixels.pixelType
});

const mapDispatchToProps = dispatch => ({
    downloadPixels: () => dispatch(downloadThePixels(true)),
    openImageExport: () => dispatch(openImageExport()),
    //downloadCode: () => dispatch(downloadTheCode()),
    unravelPixels: () => dispatch(clearThePixels()),
    downloadStitches: () => dispatch(downloadTheStitches(true))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DownloadButton);
