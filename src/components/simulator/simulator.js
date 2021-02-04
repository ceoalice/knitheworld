import React from 'react';

import {getColorHex} from '../../lib/colors.js';
import {getRGBfromHex} from '../../lib/colors.js';

import styles from './simulator.css';

class SimulatorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.pixelCanvas = React.createRef();
        this.refreshCanvas = this.refreshCanvas.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.refreshCanvas);
        this.refreshCanvas();
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.refreshCanvas);
    }

    componentDidUpdate() {
        this.refreshCanvas();
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

        // console.log("canvas" + canvas.toDataURL());
    }

    downloadPixels(canvas) {

    }

    drawPixelKnit(ctx){
        const {
            pixelCount,
            selectedPixel,
            pixelColors,
            rowCount,
            currentColor
        } = {...this.props};

        const version = "v2.3.21.0"

        // note pixelCount is a legacy variable from pixelplay,
        // it refers to the number of columns in the pattern as
        // as set by the user.

        // pixelCount (number of columns) is initialized to 10 inside
        // pixeplay/src/reducers/pixels.js

        // console.log(pixelColors);

        function drawStitch(x, y, size, visibility){

            // approximate scale factor: 1/42 = 0.02381

            // ctx.scale(size*0.015, size*0.015);

            const scaleFactor = 0.5*size/20
            const translator = !visibility ? [14, 26] : [55, 100];

            ctx.scale(scaleFactor, scaleFactor);
            ctx.translate((x-translator[0])/scaleFactor, (y-translator[1])/scaleFactor);

            // ctx.translate((x-35), y-60);

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

            // ctx.scale(size/0.015, size/0.015);
            // ctx.translate(x+35, y+60);
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

        // draw the 'carriage' from which the pattern will appear
        ctx.fillStyle = '#555555'
        ctx.fillRect(this.width*1/6, 0, this.width*2/3, carriageDepth);

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(version, 55, this.height - 10);

        if (!this.props.fullscreenVisible) {

        }

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

export default SimulatorComponent;
