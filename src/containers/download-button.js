// import React from 'react';
// import {connect} from 'react-redux';
// import PropTypes from 'prop-types';
// import VM from 'scratch-vm';

// import VMScratchBlocks from '../lib/blocks.js';

// import BlockEncoder from '../lib/block-encoder.js';
// import WebBluetooth from '../lib/webbt.js';

// import DownloadButtonComponent from '../components/download-button/download-button.js';

// class DownloadButton extends React.Component {
//     constructor (props) {
//         super(props);
//         this.handleClick = this.handleClick.bind(this);
//         this.blockEncoder = new BlockEncoder(props.vm.runtime);
//     }

//     async handleClick () {
//         if (this.props.projectRunning) {
//             this.props.vm.runtime.stopAll();
//         } else {
//             // this.props.vm.runtime.startHats('event_whenstarted');
//             const stacks = this.blockEncoder.getStacks();
//             for (let i=1; i<=stacks.length; i++) {
//                 console.log('Stack ' + i + ': ' + JSON.stringify(stacks[i-1]));
//             }
//             const blocks = [];
//             stacks.forEach(stack => blocks.push(stack.blocks));
//             const vectors = [];
//             for (let i=0; i<64; i++) vectors[i] = 0;
//             const procs = [];
//             this.blockEncoder.compileStacks(blocks, vectors, procs);
//             for (let i=0; i<(procs.length%8); i++) procs.push(255);
//             const data = vectors.concat(procs);

//             console.log(data);
//             console.log('erasing flash');
//             await WebBluetooth.sendAndWaitForResp([0xfb, 0, 0, 6, 0], 0xbf);
//             console.log('sending pixel count');
//             await WebBluetooth.sendAndWaitForResp([0xfd, this.props.pixelCount], 0xbf);
//             console.log('writing flash');
//             let out = [0xfc];
//             const addr = 0x60000;
//             for (let i=0; i<4; i++) {
//                 out[i+1] = (addr >> (i*8)) & 0xFF;
//                 out[i+5] = (data.length >> (i*8)) & 0xFF;
//             }
//             out = out.concat(data);
//             console.log(out);
//             await WebBluetooth.sendAndWaitForResp(out, 0xcf);
//             await WebBluetooth.send([0xf1]);
//         }
//     }

//     render () {
//         return (
//             <DownloadButtonComponent
//                 projectRunning={this.props.projectRunning}
//                 fullscreenVisible={this.props.fullscreenVisible}
//                 handleClick={this.handleClick}
//             />
//         );
//     }
// }

// DownloadButton.propTypes = {
//     projectRunning: PropTypes.bool,
//     fullscreenVisible: PropTypes.bool,
//     vm: PropTypes.instanceOf(VM)
// };

// const mapStateToProps = state => ({
//     projectRunning: state.projectState.projectRunState,
//     pixelCount: state.pixels.pixelCount
// });

// export default connect(mapStateToProps)(DownloadButton);

import React from 'react';
import {connect} from 'react-redux';

import {
    downloadThePixels,
    downloadTheCode,
    clearThePixels,
    downloadTheStitches
} from '../reducers/pixels.js';

import VMScratchBlocks from '../lib/blocks.js';

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
        var xml = VMScratchBlocks.getXML();
        console.log("downloading code");
        console.log(VMScratchBlocks.getXML());
        var xmlFile = new Blob([xml], { type: "application/xml;charset=utf-8" });
        console.log(xmlFile)
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
    //downloadCode: () => dispatch(downloadTheCode()),
    unravelPixels: () => dispatch(clearThePixels()),
    downloadStitches: () => dispatch(downloadTheStitches(true))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DownloadButton);
