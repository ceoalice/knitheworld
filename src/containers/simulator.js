import React from 'react';

import {connect} from 'react-redux';

import {
    moveNextPixel,
    movePreviousPixel,
    changePixelColor,
    setPixelColor,
    moveForwardPixels,
    moveBackPixels,
    setAllPixelColor,
    goToNextRow,
    knitXStitches,
    knitUntilEndOfTheRow,
    castOnXStitches,
    castOffXStitches,
    changeYarnColor,
    removeLastRow,
    downloadThePixels,
    downloadTheCode
} from '../reducers/pixels.js';

import SimulatorComponent from '../components/simulator/simulator.js'

class Simulator extends React.Component {
    constructor(props) {
        super(props);
        this.vm = this.props.vm;
        this.dispatchPixelCommand = this.dispatchPixelCommand.bind(this);
    }

    componentDidMount() {
        this.vm.on('PIXEL_EVENT', this.dispatchPixelCommand);
    }

    componentWillUnmount() {
        this.vm.removeListener('PIXEL_EVENT', this.dispatchPixelCommand);
    }

    dispatchPixelCommand (data) {
        switch (data.type) {
        case 'nextPixel':
            this.props.nextPixel();
            break;
        case 'previousPixel':
            this.props.previousPixel();
            break;
        case 'changeColor':
            this.props.changePixel(data.value);
            break;
        case 'setColor':
            this.props.setPixel(data.value);
            break;
        case 'forwardPixel':
            this.props.forwardPixel(data.value);
            break;
        case 'backPixel':
            this.props.backPixel(data.value);
            break;
        case 'setAllPixels':
            this.props.setAllPixels(data.value);
            break;
        case 'nextRow':
            this.props.nextRow();
            break;
        case 'knitStitches':
            this.props.knitStitches(data.value);
            break;
        case 'knitUntilEndOfRow':
            this.props.knitUntilEndOfRow();
            break;
        case 'castOnStitches':
            this.props.castOnStitches(data.value);
            break;
        case 'castOffStitches':
            this.props.castOffStitches();
            break;
        case 'changeColorTo':
            this.props.changeColorTo(data.value);
            break;
        case 'removeRow':
            this.props.removeRow();
            break;
        case 'downloadPixels':
            this.props.downloadPixels();
            break;
        case 'downloadCode':
            this.props.downloadCode();
        }
    }

    render() {
        return (
            <SimulatorComponent
                pixelType={this.props.pixelType}
                selectedPixel={this.props.selectedPixel}
                pixelCount={this.props.pixelCount}
                pixelColors={this.props.pixelColors}
                rowCount={this.props.rowCount}
                knitDelay={this.props.knitDelay}
                currentColor={this.props.currentColor}
                fullscreenVisible={this.props.fullscreenVisible}
                downloadingPixels={this.props.downloadingPixels}
            />
        );
    }
}

const mapStateToProps = state => ({
    pixelType: state.pixels.pixelType,
    selectedPixel: state.pixels.selectedPixel,
    pixelCount: state.pixels.pixelCount,
    pixelColors: state.pixels.pixelColors,
    knitDelay: state.pixels.knitDelay,
    rowCount: state.pixels.rowCount,
    currentColor: state.pixels.currentColor,
    fullscreenVisible: state.modals.fullscreenSimulator,
    downloadingPixels: state.pixels.downloadingPixels
});

const mapDispatchToProps = dispatch => ({
    nextPixel: () => dispatch(moveNextPixel()),
    previousPixel: () => dispatch(movePreviousPixel()),
    changePixel: value => dispatch(changePixelColor(value)),
    setPixel: value => dispatch(setPixelColor(value)),
    forwardPixel: value => dispatch(moveForwardPixels(value)),
    backPixel: value => dispatch(moveBackPixels(value)),
    setAllPixels: value => dispatch(setAllPixelColor(value)),
    nextRow: () => dispatch(goToNextRow()),
    knitStitches: value => dispatch(knitXStitches(value)),
    knitUntilEndOfRow: () => dispatch(knitUntilEndOfTheRow()),
    castOnStitches: value => dispatch(castOnXStitches(value)),
    castOffStitches: () => dispatch(castOffXStitches()),
    changeColorTo: value => dispatch(changeYarnColor(value)),
    removeRow: () => dispatch(removeLastRow()),
    downloadPixels: () => dispatch(downloadThePixels()),
    downloadCode: () => dispatch(downloadTheCode())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Simulator);
