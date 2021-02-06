import React from 'react';
import {connect} from 'react-redux';

import {getColorHex} from '../../lib/colors.js';
import {getRGBfromHex} from '../../lib/colors.js';

import {
  downloadThePixels,
  downloadTheStitches
} from '../../reducers/pixels.js';

import styles from './simulator.css';

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
        this.toggleDownload(1);
        console.log("downloading!");
      }
      if (this.props.downloadingStitches === true){
        this.toggleDownload(2);
        console.log("downloading stitches!");
      }

      this.refreshCanvas();
    }

    // type of download: 1 = pixels, 2 = stitches
    toggleDownload (type) {
      const {
          pixelCount,
          selectedPixel,
          pixelColors,
          rowCount,
          currentColor
      } = {...this.props};

      if (type === 1) {
        this.props.toggleDownloadPixels();
        console.log("toggled to " + this.props.downloadingPixels + "!");

        // make new canvas for downloading here

        const pixelCanvas = document.createElement('canvas');
        console.log("pixelCanvas is " + pixelCanvas);
        console.log(pixelCanvas);
        pixelCanvas.width = pixelCount;
        pixelCanvas.height = rowCount;

        const pixelctx = pixelCanvas.getContext('2d');

        pixelctx.save();

        let stitchCount = pixelCount * rowCount;

        for (let i=0; i<stitchCount; i++) {
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
      }

      else if (type === 2) {
        this.props.toggleDownloadStitches();
        console.log("toggled to " + this.props.downloadingStitches + "!");

        const pixelCanvas = document.createElement('canvas');
        console.log("pixelCanvas is " + pixelCanvas);
        console.log(pixelCanvas);
        pixelCanvas.width = 25*pixelCount+10;
        pixelCanvas.height = 25*rowCount+10;

        const pixelctx = pixelCanvas.getContext('2d');

        pixelctx.save();

        function drawStitch(x, y, size){
            //
            // var img = new Image();
            // img.onload = function() {
            //   ctx.drawImage(img, x, y);
            // }
            // img.src = "./knit-block-icon.svg";

            const scaleFactor = 0.5*size/20
            const translator = [14, 26];

            pixelctx.scale(scaleFactor, scaleFactor);
            pixelctx.translate((x-translator[0])/scaleFactor, (y-translator[1])/scaleFactor);


            pixelctx.translate(50, 83);
            pixelctx.rotate(Math.PI/3);
            pixelctx.translate(-50, -83);

            pixelctx.beginPath();
            pixelctx.moveTo(25, 75);
            pixelctx.lineTo(50,75);
            pixelctx.arc(50,100,25,6*Math.PI/4, 0,false);
            pixelctx.lineTo(50, 100);
            pixelctx.arc(50,75,25,Math.PI/2,Math.PI,false);
            pixelctx.closePath();
            pixelctx.fill();

            pixelctx.translate(50, 83);
            pixelctx.rotate(-1*Math.PI/3);
            pixelctx.translate(-50, -83);

            pixelctx.translate(67, 83);
            pixelctx.rotate(-1*Math.PI/3);
            pixelctx.translate(-67, -83);

            pixelctx.moveTo(92,75);
            pixelctx.lineTo(67,75);
            pixelctx.arc(67,100,25,6*Math.PI/4, Math.PI, true);
            pixelctx.lineTo(67,100);
            pixelctx.arc(67,75,25,Math.PI/2,0,true);
            pixelctx.fill();

            pixelctx.translate(67, 83);
            pixelctx.rotate(Math.PI/3);
            pixelctx.translate(-67, -83);

            pixelctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        let stitchCount = pixelCount * rowCount;

        for (let i=0; i<stitchCount; i++) {
          // draw jawns
          pixelctx.fillStyle = pixelColors[i];
          let currentRow = Math.floor(i/pixelCount);
          drawStitch(25*(i%pixelCount), 25*currentRow, 20);
        }

        pixelctx.restore();

        let a = document.createElement('a');
        a.setAttribute('download', 'My Knit Pattern.png');
        pixelCanvas.toBlob(blob => {
            let url = URL.createObjectURL(blob);
            a.setAttribute('href', url);
            a.click();
        });
      }
    }

    refreshCanvas () {
        this.width = this.canvasRef.current.getBoundingClientRect().width;
        this.height = this.canvasRef.current.getBoundingClientRect().height;
        this.canvasRef.current.width = this.width;
        this.canvasRef.current.height = this.height;
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.save();

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

    drawPixelKnit(ctx){
        const {
            pixelCount,
            selectedPixel,
            pixelColors,
            rowCount,
            currentColor
        } = {...this.props};

        const version = "v2.5.21.1"
        // note pixelCount is a legacy variable from pixelplay,
        // it refers to the number of columns in the pattern as
        // as set by the user.

        // console.log(pixelColors);

        function drawStitch(x, y, size, visibility){
            //
            // var img = new Image();
            // img.onload = function() {
            //   ctx.drawImage(img, x, y);
            // }
            // img.src = "./knit-block-icon.svg";

            const scaleFactor = 0.5*size/20
            const translator = !visibility ? [14, 26] : [55, 100];

            ctx.scale(scaleFactor, scaleFactor);
            ctx.translate((x-translator[0])/scaleFactor, (y-translator[1])/scaleFactor);


            ctx.translate(50, 83);
            ctx.rotate(Math.PI/3);
            ctx.translate(-50, -83);

            ctx.beginPath();
            ctx.moveTo(25, 75);
            ctx.lineTo(50,75);
            ctx.arc(50,100,25,6*Math.PI/4, 0,false);
            ctx.lineTo(50, 100);
            ctx.arc(50,75,25,Math.PI/2,Math.PI,false);
            ctx.closePath();
            ctx.fill();

            ctx.translate(50, 83);
            ctx.rotate(-1*Math.PI/3);
            ctx.translate(-50, -83);

            ctx.translate(67, 83);
            ctx.rotate(-1*Math.PI/3);
            ctx.translate(-67, -83);

            ctx.moveTo(92,75);
            ctx.lineTo(67,75);
            ctx.arc(67,100,25,6*Math.PI/4, Math.PI, true);
            ctx.lineTo(67,100);
            ctx.arc(67,75,25,Math.PI/2,0,true);
            ctx.fill();

            ctx.translate(67, 83);
            ctx.rotate(Math.PI/3);
            ctx.translate(-67, -83);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        const padding = 15;
        const carriageDepth = 25;

        // console.log("current color from simulator: ")
        // console.log(currentColor);
        // let currentColorRGB = getRGBfromHex(currentColor);

        const stitchCount = pixelCount * rowCount;

        const gridSize = !this.props.fullscreenVisible ? (this.height - padding) / 2 :
            this.height < this.width ? (this.height - 120) / 2 : (this.width - 120) / 2;

        const pixelSize = !this.props.fullscreenVisible ? 12 : 30;
        const pixelGap = !this.props.fullscreenVisible ? 5 : 5;

        for (let i=0; i<stitchCount; i++){
          let currentRow = Math.floor(i/pixelCount);

          let relativeX = (i%pixelCount) * (pixelSize + pixelGap);
          let relativeY = currentRow * (pixelSize + pixelGap);

          let rowCountX = this.width/2-pixelCount*(pixelSize + pixelGap)/2-pixelSize-pixelGap;

          let currentX = 0;
          // controls direction of pixel movement
          // starts left to right, alternates
          if (currentRow % 2 == 0){
              currentX += this.width/2+relativeX-(pixelCount*(pixelSize + pixelGap)/2);
          }
          else {
              currentX += this.width/2-relativeX+((pixelCount-2)*(pixelSize + pixelGap)/2);
          }

          let currentY = relativeY + carriageDepth*1.25 + pixelGap;

          let dark = "#d9d9d9"
          let light = "#ffffff"

          let gridColor = dark;
          if (i%2 === 0){
            gridColor = dark;
          }
          else{
            gridColor = light;
          }

          ctx.fillStyle = gridColor;
          ctx.fillRect(currentX, currentY, pixelSize, pixelSize);

        }

        // draw the 'carriage' from which the pattern will appear
        ctx.fillStyle = '#555555'
        ctx.fillRect(this.width*1/6, 0, this.width*2/3, carriageDepth);

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(version, 55, this.height - 10);

        for (let i=0; i<stitchCount; i++){
            let currentRow = Math.floor(i/pixelCount);

            let relativeX = (i%pixelCount) * (pixelSize + pixelGap);
            let relativeY = currentRow * (pixelSize + pixelGap);

            let rowCountX = this.width/2-pixelCount*(pixelSize + pixelGap)/2-pixelSize-pixelGap;

            let currentX = 0;

            // controls direction of pixel movement
            // starts left to right, alternates
            // if (currentRow % 2 == 0){
            //     currentX += this.width/2+relativeX-(pixelCount*(pixelSize + pixelGap)/2);
            // }
            // else {
            //     currentX += this.width/2-relativeX+((pixelCount-2)*(pixelSize + pixelGap)/2);
            // }

            currentX += this.width/2+relativeX-(pixelCount*(pixelSize + pixelGap)/2);

            let currentY = relativeY + carriageDepth*1.25 + pixelGap;

            ctx.strokeStyle = '#ffd500'
            ctx.fillStyle = pixelColors[i];
            // ctx.fillRect(currentX, currentY, pixelSize, pixelSize);
            // ctx.strokeRect(currentX, currentY, pixelSize, pixelSize);

            drawStitch(currentX, currentY, pixelSize, this.props.fullscreenVisible);

            if (i<=pixelCount){
              ctx.fillStyle = '#ffffff';
              ctx.fillText(i + 1, currentX, carriageDepth/2);
            }

            if (i%rowCount==0) {
              ctx.fillStyle = '#ffffff';
              ctx.fillText(i/rowCount+1, rowCountX, currentY);
            }

            ctx.fillStyle = '#333333';
            ctx.textAlign = 'center';
            if (i<99){
              ctx.font = '10px sans-serif';
            }
            else if (i<999){
              ctx.font = '9px sans-serif';
            }
            else {
              ctx.font = '7px sans-serif';
            }
        }
    }

    render() {
        return (
            <canvas
                className={styles.simulator}
                ref={this.canvasRef}
            />
        );
    }
}

CanvasRenderingContext2D.prototype.roundedRect = function(x, y, w, h, r) {
    const halfRadians = (2 * Math.PI) / 2;
    const quarterRadians = (2 * Math.PI) / 4;
    this.arc(r+x, r+y, r, -quarterRadians, halfRadians, true);
    this.lineTo(x, y+h-r);
    this.arc(r+x, h-r+y, r, halfRadians, quarterRadians, true);
    this.lineTo(x+w-r, y+h);
    this.arc(x+w-r, y+h-r, r, quarterRadians, 0, true);
    this.lineTo(x+w, y+r);
    this.arc(x+w-r, y+r, r, 0, -quarterRadians, true);
    this.lineTo(x+r, y);
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
