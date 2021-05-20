import React from 'react';
import {connect} from 'react-redux';

import {openImageExport} from '../reducers/modals.js';
import {downloadTheStitches} from '../reducers/pixels.js';
import RgbQuant from "rgbquant";
import SimulatorToolsComponent from '../components/simulator-tools/simulator-tools.js';

function RGBArrayToUIntArray(array) {
  let out = []
  array.forEach(rgb => {
    let s = rgb.split(/\(|,|\)/)
    out.push(Number(s[1])); // red
    out.push(Number(s[2])); // green
    out.push(Number(s[3])); // blue
    out.push(1); // alpha
  })
  return out;
}

function UIntArrayToRGBArray(array) {
  let out = []
  for (let i = 0; i < array.length-3; i+=4) {
    out.push(`rgb(${array[i]},${array[i+1]},${array[i+2]})`)
  }
  return  out;
}
class SimulatorTools extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          maxColors: 4,
        }
        this.downloadPixelPattern = this.downloadPixelPattern.bind(this);
        this.downloadStitchPattern = this.downloadStitchPattern.bind(this);
        this.toggleDownload = this.toggleDownload.bind(this);

    }

    componentDidUpdate() {
      if (this.props.downloadingStitches){
        this.toggleDownload();
        console.log("downloading stitches!");
      }
    }

    toggleDownload () {
      this.props.toggleDownloadStitches();
      this.downloadPixelPattern();
      // this.downloadStitchPattern();
    }

    downloadPixelPattern() {
      // console.log("GOT HERE");
      const {pixelCount, pixelColors, rowCount} = {...this.props};
      let stitchCount = pixelCount * rowCount;
        // console.log("toggled to " + this.props.downloadingPixels + "!");

        // make new canvas for downloading here
        // const isBlackOrWhite = color => color === "rgb(255,255,255)" || color === "rgb(0,0,0)";

        const pixelCanvas = document.createElement('canvas');

        let q = new RgbQuant({
          colors: this.state.maxColors,
          palette: [[0,0,0],[255,255,255]]
        });

        // we store data about every pixel on the canvas, regardless of whether
        // it has been knit. this handles the "empty" (transparent) stitches
        let totalPixels = pixelColors.reduce((a,b) => a + (!b.includes("rgba(") ? 1 : 0), 0)

        // pixelColors.splice(totalPixels);
        // console.log(pixelColors.length);

        let UIntArray = RGBArrayToUIntArray(pixelColors);

        // console.log(UIntArray);
        // q.sample([0,0,0,1,255,255,255,1,0,0,0,1,255,255,255,1,0,0,0,1,255,255,255,1,0,0,0,1,255,255,255,1,0,0,0,1,255,255,255,1],2);
        q.sample(UIntArray, pixelCount)
       
        console.log(UIntArrayToRGBArray(q.palette(false,true)));
        console.log(q);
        
        let newPixelColors = UIntArrayToRGBArray(q.reduce(UIntArray));
      
        pixelCanvas.width = pixelCount;
        pixelCanvas.height = Math.ceil(totalPixels/pixelCount);

        const pixelctx = pixelCanvas.getContext('2d');

        pixelctx.save();        

        for (let i=0; i<totalPixels; i++) {
          pixelctx.fillStyle = newPixelColors[i];
          let currentRow = Math.floor(i/pixelCount);
          pixelctx.fillRect(i%pixelCount, currentRow, 1, 1);
        }

        pixelctx.restore();

        let a = document.createElement('a');
        a.setAttribute('download',
          Boolean(this.props.downloadingStitchesName) 
          ? `${this.props.downloadingStitchesName}PixelPattern.png`
          : 'MyProjectPixelPattern.png');
        pixelCanvas.toBlob(blob => {
            let url = URL.createObjectURL(blob);
            a.setAttribute('href', url);
            a.click();
        });
    }

    downloadStitchPattern() {
      const {pixelCount, pixelColors, rowCount} = {...this.props};
      const stitchCanvas = document.createElement('canvas');
      let stitchCount = pixelCount * rowCount;

      // tally up all stitches that are actually colors
      let totalStitches = pixelColors.reduce((a,b) => a + (!b.includes("rgba(") ? 1 : 0), 0)
      pixelColors.splice(totalStitches); /// removing transparent pixels

      stitchCanvas.width = 25*pixelCount+10;
      stitchCanvas.height = 25*(Math.ceil(totalStitches/pixelCount))+10;

      const stitchctx = stitchCanvas.getContext('2d');

      stitchctx.save();

      for (let i=0; i<totalStitches; i++) {
        stitchctx.fillStyle = pixelColors[i];
        let currentRow = Math.floor(i/pixelCount);
        stitchctx.drawStitch(25*(i%pixelCount), 25*currentRow, 20);
      }

      stitchctx.restore();

      let b = document.createElement('a');

      b.setAttribute('download', 
          Boolean(this.props.downloadingStitchesName) 
          ? `${this.props.downloadingStitchesName}KnitPattern.png`
          : 'MyProjectKnitPattern.png');

      stitchCanvas.toBlob(blob => {
          let url = URL.createObjectURL(blob);
          b.setAttribute('href', url);
          b.click();
      });
    }

    render() {
        return (
            <SimulatorToolsComponent {...this.props} />
        );
    }
}

const mapStateToProps = state => ({
    pixelCount: state.pixels.pixelCount, 
    pixelColors : state.pixels.pixelColors, 
    rowCount: state.pixels.rowCount,
    pixelType: state.pixels.pixelType,
    downloadingStitches: state.pixels.downloadingStitches,
    downloadingStitchesName: state.pixels.downloadingStitchesName
});

const mapDispatchToProps = dispatch => ({
    openImageExport : () => dispatch(openImageExport()),
    toggleDownloadStitches: () => dispatch(downloadTheStitches(false)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SimulatorTools);
