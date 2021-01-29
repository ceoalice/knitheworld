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
import PropTypes from 'prop-types';

import {downloadThePixels} from '../reducers/pixels.js';

import DownloadButtonComponent from '../components/knit-buttons/download-button.js';

class DownloadButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick () {
        this.props.downloadPixels();
    }

    render () {
        return (
            <DownloadButtonComponent
                handleClick={this.handleClick}
            />
        );
    }
}

DownloadButton.propTypes = {
    downloadPixels: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
    downloadPixels: () => dispatch(downloadThePixels())
});

export default connect(null, mapDispatchToProps)(DownloadButton);
