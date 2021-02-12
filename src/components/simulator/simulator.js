import React from 'react';
import {connect} from 'react-redux';

import {getColorHex} from '../../lib/colors.js';
import {getRGBfromHex} from '../../lib/colors.js';

import {
  downloadThePixels,
  downloadTheStitches
} from '../../reducers/pixels.js';

import styles from './simulator.css';

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

class SimulatorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.toggleDownload = this.toggleDownload.bind(this);
        this.refreshCanvas = this.refreshCanvas.bind(this);
        window.download = this.toggleDownload;
    }

    componentDidMount() {
        window.addEventListener('resize', this.refreshCanvas);
        this.refreshCanvas();
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.refreshCanvas);
    }

    componentDidUpdate () {
      if (this.props.downloadingPixels === true){
        this.toggleDownload();
        console.log("downloading!");
      }
      if (this.props.downloadingStitches === true){
        this.toggleDownload();
        console.log("downloading stitches!");
      }

      this.refreshCanvas();
    }

    refreshCanvas () {
        // this.width = this.canvasRef.current.getBoundingClientRect().width;
        // this.height = this.canvasRef.current.getBoundingClientRect().height;

        this.width = this.canvasRef.current.offsetWidth;
        this.height = this.canvasRef.current.offsetHeight;

        this.canvasRef.current.width = this.width;
        this.canvasRef.current.height = this.height;
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.save();

        // console.log("width is " + this.width);
        // console.log("height is " + this.height);

        // check if size

        // this.pixelCanvas.width = this.props.pixelCount;
        // this.pixelCanvas.height = this.props.rowCount;

        //Draw background
        ctx.clearRect(0, 0, this.width, this.height);

        if (this.props.pixelType === 'ring') {
            this.drawPixelRing(ctx);
        } else if (this.props.pixelType === 'strip') {
            this.drawPixelStrip(ctx);
        } else {
            this.drawPixelKnit(ctx);
        }

        ctx.restore();
    }

    // \/ legacy from when two different buttons
    // type of download: 1 = pixels, 2 = stitches
    toggleDownload (type) {
      const {
          pixelCount,
          selectedPixel,
          pixelColors,
          rowCount,
          currentColor
      } = {...this.props};

      // if (type === 1) {
        // this.props.toggleDownloadPixels();
        this.props.toggleDownloadStitches();
        console.log("toggled to " + this.props.downloadingPixels + "!");

        // make new canvas for downloading here

        const pixelCanvas = document.createElement('canvas');

        // we store data about every pixel on the canvas, regardless of whether
        // it has been knit. this handles the "empty" (transparent) stitches
        let pixelRows = 0;
        for (let i=0; i<pixelColors.length; i++){
          if (!pixelColors[i].includes("rgba(")){
            pixelRows += 1;
          }
        }

        pixelCanvas.width = pixelCount;
        pixelCanvas.height = Math.ceil(pixelRows/pixelCount);

        const pixelctx = pixelCanvas.getContext('2d');

        pixelctx.save();

        let stitchCount = pixelCount * rowCount;

        for (let i=0; i<pixelColors.length; i++) {
          pixelctx.fillStyle = pixelColors[i];
          let currentRow = Math.floor(i/pixelCount);
          pixelctx.fillRect(i%pixelCount, currentRow, 1, 1);
        }

        pixelctx.restore();

        let a = document.createElement('a');
        a.setAttribute('download', 'My Pixel Pattern.png');
        pixelCanvas.toBlob(blob => {
            let url = URL.createObjectURL(blob);
            a.setAttribute('href', url);
            a.click();
        });
      // }
      //
      // else if (type === 2) {
        // this.props.toggleDownloadStitches();
        console.log("toggled to " + this.props.downloadingStitches + "!");

        const stitchCanvas = document.createElement('canvas');

        let stitchRows = 0;

        for (let i=0; i<pixelColors.length; i++){
          if (!pixelColors[i].includes("rgba(")){
            stitchRows += 1;
          }
        }

        stitchCanvas.width = 25*pixelCount+10;
        stitchCanvas.height = 25*(Math.ceil(stitchRows/pixelCount))+10;

        const stitchctx = stitchCanvas.getContext('2d');

        stitchctx.save();

        for (let i=0; i<stitchCount; i++) {
          stitchctx.fillStyle = pixelColors[i];
          let currentRow = Math.floor(i/pixelCount);
          stitchctx.drawStitch(25*(i%pixelCount), 25*currentRow, 20);
        }

        stitchctx.restore();

        let b = document.createElement('a');
        b.setAttribute('download', 'My Knit Pattern.png');
        stitchCanvas.toBlob(blob => {
            let url = URL.createObjectURL(blob);
            b.setAttribute('href', url);
            b.click();
        });
      // }
    }

    drawPixelKnit(ctx){
        const {
            pixelCount,
            selectedPixel,
            pixelColors,
            rowCount,
            currentColor
        } = {...this.props};

        const topSpace = 0.1;
        const leftSpace = 0.1;

        const top = 50;
        const left = 50;

        const padding = 15;
        const carriageDepth = 25;

        const stitchCount = pixelCount * rowCount;

        const pixelSize = 12;
        const pixelGap = 5;

        // draw "carriage," number/grid border thing
        ctx.fillStyle = "#c2e3f9";
        ctx.beginPath();
        ctx.moveTo(0+left, (pixelSize + pixelGap)*2-(2*pixelGap))+top;
        ctx.lineTo(0+left, ((pixelSize+pixelGap)*(rowCount+1))+pixelSize-pixelGap+top)
        ctx.lineTo(((pixelSize + pixelGap)*2)-(2*pixelGap)+left, ((pixelSize+pixelGap)*(rowCount+1))+pixelSize-pixelGap+top);
        ctx.lineTo(((pixelSize + pixelGap)*2)-(2*pixelGap)+left, ((pixelSize+pixelGap)*2)-(2*pixelGap)+top);
        ctx.lineTo(((pixelSize+pixelGap)*(pixelCount+1)+pixelSize-pixelGap)+left, ((pixelSize+pixelGap)*2)-(2*pixelGap)+top);
        ctx.lineTo(((pixelSize+pixelGap)*(pixelCount+1)+pixelSize-pixelGap)+left, 0+top);
        ctx.lineTo(((pixelSize + pixelGap)*2)-(2*pixelGap)+left, 0+top);
        ctx.arc(((pixelSize + pixelGap)*2)-(2*pixelGap)+left, ((pixelSize+pixelGap)*2)-(2*pixelGap)+top, ((pixelSize + pixelGap)*2)-(2*pixelGap), 3*Math.PI/2, Math.PI, true);
        ctx.fill();

        // design prep for text
        ctx.textAlign = 'center';
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#ffffff';

        // draw column (stitch) count numbers
        for (let i=0; i<pixelCount; i++){
          ctx.fillText(i + 1, (i+2)*(pixelSize+pixelGap)-(pixelGap/2)+left, pixelSize+(pixelGap/2)+top);
        }

        // draw row count numbers
        for (let i=0; i<rowCount; i++){
          ctx.fillText(i+1, pixelSize+left, (i+2)*(pixelSize+pixelGap)+top);
        }

        ctx.globalAlpha = 0.3;

        // draw gray and white canvas background grid
        for (let i=0; i<stitchCount; i++){

          let currentRow = Math.floor(i/pixelCount);

          let dark = "#d9d9d9"
          let light = "#ffffff"

          let gridColor = dark;

          // \/ this took every single one of my braincells, I don't know why
          if ((i%pixelCount)%2 === 0){
            if (currentRow%2 === 0)
              gridColor = dark;
            else
              gridColor = light;
          }
          else {
            if (currentRow%2 === 0)
              gridColor = light;
            else
              gridColor = dark;
          }

          let currentX = (pixelSize + pixelGap)*((i%pixelCount)+2)-(2*pixelGap);
          let currentY = (pixelSize + pixelGap)*(currentRow+2)-(2*pixelGap);

          ctx.fillStyle = gridColor;
          ctx.fillRect(currentX+left, currentY+top, pixelSize+pixelGap, pixelSize+pixelGap);

        }

        ctx.globalAlpha = 1;

        // draw the stitches from the block data :)
        for (let i=0; i<stitchCount; i++){
            let currentRow = Math.floor(i/pixelCount);

            let relativeX = (i%pixelCount) * (pixelSize + pixelGap);
            let relativeY = currentRow * (pixelSize + pixelGap);

            let rowCountX = this.width/2-pixelCount*(pixelSize + pixelGap)/2-pixelSize-pixelGap;

            // let currentX = 0;
            //
            // // controls direction of pixel movement
            // // starts left to right, alternates
            // // if (currentRow % 2 == 0){
            // //     currentX += this.width/2+relativeX-(pixelCount*(pixelSize + pixelGap)/2);
            // // }
            // // else {
            // //     currentX += this.width/2-relativeX+((pixelCount-2)*(pixelSize + pixelGap)/2);
            // // }
            //
            // currentX += this.width/2+relativeX-(pixelCount*(pixelSize + pixelGap)/2);
            //
            // let currentY = relativeY + carriageDepth*1.25 + pixelGap;

            let currentX = (pixelSize + pixelGap)*((i%pixelCount)+2)-(pixelGap);
            let currentY = (pixelSize + pixelGap)*(currentRow+2);

            ctx.strokeStyle = '#ffd500'
            ctx.fillStyle = pixelColors[i];
            // ctx.fillRect(currentX, currentY, pixelSize, pixelSize);
            // ctx.strokeRect(currentX, currentY, pixelSize, pixelSize);

            ctx.drawStitch(currentX+left, currentY+top, pixelSize);
        }
    }

    render() {
        return (
          // <TransformWrapper
          //   scale={1.5}
          //   zoomIn={{step: 500}}
          //   limitToBounds={false}
          //   defaultPositionX={0}
          //   defaultPositionY={0}
          //   // options={{wrapperClass: styles.transform}}
          // >
          //   <TransformComponent
          //     // options={{wrapperClass: styles.transform}}
          //   >
              <canvas
                  className={styles.simulator}
                  ref={this.canvasRef}
              />
          //   </TransformComponent>
          // </TransformWrapper>
        );
    }
}

CanvasRenderingContext2D.prototype.drawStitch = function(x, y, size) {

    // handles the ctx / svg path mess that draws the stitch shape on the canvas
    // draws large scale and then scales to fit using an arbitrary scale factor :)

    const scaleFactor = 0.5*size/20
    const translator = [14, 26];
    this.scale(scaleFactor, scaleFactor);
    this.translate((x-translator[0])/scaleFactor, (y-translator[1])/scaleFactor);

    this.translate(50, 83);
    this.rotate(Math.PI/3);
    this.translate(-50, -83);

    this.beginPath();
    this.moveTo(25, 75);
    this.lineTo(50,75);
    this.arc(50,100,25,6*Math.PI/4, 0,false);
    this.lineTo(50, 100);
    this.arc(50,75,25,Math.PI/2,Math.PI,false);
    this.closePath();
    this.fill();

    this.translate(50, 83);
    this.rotate(-1*Math.PI/3);
    this.translate(-50, -83);

    this.translate(67, 83);
    this.rotate(-1*Math.PI/3);
    this.translate(-67, -83);

    this.moveTo(92,75);
    this.lineTo(67,75);
    this.arc(67,100,25,6*Math.PI/4, Math.PI, true);
    this.lineTo(67,100);
    this.arc(67,75,25,Math.PI/2,0,true);
    this.fill();

    this.translate(67, 83);
    this.rotate(Math.PI/3);
    this.translate(-67, -83);

    this.setTransform(1, 0, 0, 1, 0, 0);
}

const mapStateToProps = state => ({
    downloadingPixels: state.pixels.downloadingPixels,
    downloadingStitches: state.pixels.downloadingStitches
});

const mapDispatchToProps = dispatch => ({
    toggleDownloadPixels: () => dispatch(downloadThePixels(false)),
    toggleDownloadStitches: () => dispatch(downloadTheStitches(false)),
    downloadCode: () => dispatch(downloadTheCode()),
    unravelPixels: () => dispatch(clearThePixels())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SimulatorComponent);
