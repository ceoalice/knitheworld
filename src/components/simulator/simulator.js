import React from 'react';
import {connect} from 'react-redux';

import styles from './simulator.css';

class SimulatorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          windowWidth : window.innerWidth,
          top: 60,
          left: 50,
          pixelSize: 12,
          pixelGap: 5
        }
        this.stitchRef = React.createRef();
        this.gridRef = React.createRef();

        this.refreshCanvas = this.refreshCanvas.bind(this);
        this.handleResize = this.handleResize.bind(this);

        window.download = this.toggleDownload;
    }

    componentDidMount() {
      this.width = this.gridRef.current.offsetWidth;
      this.height = this.gridRef.current.offsetHeight;

      this.gridRef.current.width = this.width;
      this.gridRef.current.height = this.height;

      this.stitchRef.current.width = this.width;
      this.stitchRef.current.height = this.height;

      window.addEventListener('resize', this.handleResize);
      this.refreshCanvas();
    }

    componentWillUnmount () {
      window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate (prevProps, prevState) {
      if (this.props.rowCount != prevProps.rowCount || this.props.pixelCount != prevProps.pixelCount) {
        this.refreshCanvas();
      } else {
        this.redrawStitches();
      }
    }

    handleResize() {
      // https://stackoverflow.com/questions/5517783/preventing-canvas-clear-when-resizing-window

      if (window.innerWidth != this.state.windowWidth) {
        this.setState({windowWidth : window.innerWidth});
        this.width = this.gridRef.current.offsetWidth;
        this.height = this.gridRef.current.offsetHeight;

        let gridCopy = document.createElement('canvas');
        let stitchCopy = document.createElement('canvas');

        gridCopy.width = this.width; 
        stitchCopy.width = this.width;

        gridCopy.height = this.height; 
        stitchCopy.height = this.height;

        gridCopy.getContext("2d").drawImage(this.gridRef.current,0,0);
        stitchCopy.getContext("2d").drawImage(this.stitchRef.current,0,0);

        this.gridRef.current.width = this.width;
        this.gridRef.current.height = this.height;

        this.stitchRef.current.width = this.width;
        this.stitchRef.current.height = this.height;


        const gridCtx = this.gridRef.current.getContext('2d');
        const stitchCtx = this.stitchRef.current.getContext('2d');

        gridCtx.drawImage(gridCopy,0,0);
        stitchCtx.drawImage(stitchCopy,0,0);
      }
    }

    async refreshCanvas() {
      // console.log("refreshing canvas");
      this.redrawGrid();
      this.redrawStitches(true);
    }

    async redrawGrid() {
      const ctx = this.gridRef.current.getContext('2d');
      const {pixelCount, rowCount} = {...this.props};
      const {top, left, pixelSize, pixelGap} = {...this.state};

      const stitchCount = pixelCount * rowCount;

      ctx.save();

      ctx.clearRect(0, 0, this.width, this.height);
      ctx.translate(left, top);

      // draw "carriage," number/grid border thing
      ctx.fillStyle = "#c2e3f9";
      ctx.beginPath();
      ctx.moveTo(0, (pixelSize + pixelGap)*2-(2*pixelGap));
      ctx.lineTo(0, ((pixelSize+pixelGap)*(rowCount+1))+pixelSize-pixelGap)
      ctx.lineTo(((pixelSize + pixelGap)*2)-(2*pixelGap), ((pixelSize+pixelGap)*(rowCount+1))+pixelSize-pixelGap);
      ctx.lineTo(((pixelSize + pixelGap)*2)-(2*pixelGap), ((pixelSize+pixelGap)*2)-(2*pixelGap));
      ctx.lineTo(((pixelSize+pixelGap)*(pixelCount+1)+pixelSize-pixelGap), ((pixelSize+pixelGap)*2)-(2*pixelGap));
      ctx.lineTo(((pixelSize+pixelGap)*(pixelCount+1)+pixelSize-pixelGap), 0);
      ctx.lineTo(((pixelSize + pixelGap)*2)-(2*pixelGap), 0);
      ctx.arc(((pixelSize + pixelGap)*2)-(2*pixelGap), ((pixelSize+pixelGap)*2)-(2*pixelGap), ((pixelSize + pixelGap)*2)-(2*pixelGap), 3*Math.PI/2, Math.PI, true);
      ctx.fill();

      // design prep for text
      ctx.textAlign = 'center';
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#ffffff';

      // draw column (stitch) count numbers
      for (let i=0; i<pixelCount; i++){
        ctx.fillText(i + 1, (i+2)*(pixelSize+pixelGap)-(pixelGap/2), pixelSize+(pixelGap/2));
      }

      // draw row count numbers
      for (let i=0; i<rowCount; i++){
        ctx.fillText(i+1, pixelSize, (i+2)*(pixelSize+pixelGap));
      }

      ctx.globalAlpha = 0.3;

      // draw gray and white canvas background grid
      for (let i=0; i<stitchCount; i++){
        let currentRow = Math.floor(i/pixelCount);

        let dark = "#d9d9d9";
        let light = "#ffffff";

        let gridColor;

        if ((i%pixelCount)%2){
          gridColor = (currentRow%2) ? dark : light;
        } else {
          gridColor = (currentRow%2) ? light : dark;
        }

        let currentX = (pixelSize + pixelGap)*((i%pixelCount)+2)-(2*pixelGap);
        let currentY = (pixelSize + pixelGap)*(currentRow+2)-(2*pixelGap);

        ctx.fillStyle = gridColor;
        ctx.fillRect(currentX, currentY, pixelSize+pixelGap, pixelSize+pixelGap);
      }

      ctx.restore();
    }

    async redrawStitches(all = false) {
      const ctx = this.stitchRef.current.getContext('2d');
      const {pixelCount, rowCount, pixelColors, updatedPixels} = {...this.props};
      const {top, left, pixelSize, pixelGap} = {...this.state};

      const stitchCount = pixelCount * rowCount;

      ctx.save();
      ctx.translate(left, top);

      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#ffd500'

      // draw the stitches from the block data :)

      if (all) { // drawing all stitches regardless of diff from previous state
        ctx.clearRect(0, 0, this.width, this.height);

        for (let i=0; i<stitchCount; i++){
          let currentRow = Math.floor(i/pixelCount);
          let currentX = (pixelSize + pixelGap)*((i%pixelCount)+2)-(pixelGap);
          let currentY = (pixelSize + pixelGap)*(currentRow+2);
          
          ctx.fillStyle = pixelColors[i];  
          ctx.drawStitch(currentX, currentY, pixelSize);
        }
      } else {
        updatedPixels.forEach( (i) => {
          if (i >= stitchCount) return;

          let currentRow = Math.floor(i/pixelCount);

          let currentX = (pixelSize + pixelGap)*((i%pixelCount)+2)-(pixelGap);
          let currentY = (pixelSize + pixelGap)*(currentRow+2);   
          let clearRectX = (pixelSize + pixelGap)*((i%pixelCount)+2)-(2*pixelGap);
          let clearRectY = (pixelSize + pixelGap)*(currentRow+2)-(2*pixelGap);

          ctx.fillStyle = pixelColors[i];
          ctx.clearRect(clearRectX, clearRectY, pixelSize+pixelGap, pixelSize+pixelGap+5);
          ctx.drawStitch(currentX, currentY, pixelSize);
        })
      }
      ctx.restore();
    }
    
    render() {
        return (
          <div className={styles.simulator}>
            <canvas
                className={styles.canvas}
                ref={this.gridRef}
            />
            <canvas
                className={styles.canvas}
                ref={this.stitchRef}
            />
          </div>
        );
    }
}

CanvasRenderingContext2D.prototype.drawStitch = function(x, y, size) {

    // handles the ctx / svg path mess that draws the stitch shape on the canvas
    // draws large scale and then scales to fit using an arbitrary scale factor :)

    const scaleFactor = 0.5*size/20
    const translator = [14, 26];
    this.save();
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

    this.restore();
}

const mapStateToProps = state => ({
    downloadingStitchesName: state.pixels.downloadingStitchesName
});

const mapDispatchToProps = dispatch => ({
    downloadCode: () => dispatch(downloadTheCode()),
    unravelPixels: () => dispatch(clearThePixels())
});

export default connect(
    null,
    mapDispatchToProps
)(SimulatorComponent);
