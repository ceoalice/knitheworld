import React from 'react';

import WebBluetooth from '../lib/webbt.js';
import BlockDecoder from '../lib/block-decoder.js';
import VMScratchBlocks from '../lib/blocks.js';

import UploadButtonComponent from '../components/upload-button/upload-button.js';

class UploadButton extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick () {
        WebBluetooth.sendAndWaitForRespLen([0xf1], 1)
            .then(res => {
                return WebBluetooth.sendAndWaitForRespLen([0xfe, 0, 0, 6, 0, res[0], 0, 0, 0], res[0])
            })
            .then(res => {
                const xmlString = BlockDecoder.decode(res);
                VMScratchBlocks.loadWorkspace(xmlString);
            });
    }

    render () {
        return (
            <UploadButtonComponent
                handleClick={this.handleClick}
            />
        );
    }
}

export default UploadButton;
