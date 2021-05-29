import React from 'react';
import {connect} from 'react-redux';

import {openImageExport} from '../reducers/modals.js';
import {downloadTheStitches} from '../reducers/pixels.js';
import RgbQuant from "rgbquant";
import SimulatorToolsComponent from '../components/simulator-tools/simulator-tools.js';

import JSZip from "jszip";
import { saveAs } from 'file-saver';


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

      let zip = new JSZip();

      this.downloadPixelPattern(zip);
      this.downloadStitchPattern(zip);

      zip.generateAsync({type:"blob"})
      .then((content) => {
          // see FileSaver.js
          saveAs(content, `${this.props.projectName}.zip`);
      });
    }

    downloadPixelPattern(zip) {
      // console.log("GOT HERE");
      const {pixelCount, pixelColors, rowCount} = {...this.props};
        // console.log("toggled to " + this.props.downloadingPixels + "!");

        // make new canvas for downloading here
        // const isBlackOrWhite = color => color === "rgb(255,255,255)" || color === "rgb(0,0,0)";

        const pixelCanvas = document.createElement('canvas');

        let q = new RgbQuant({
          colors: this.state.maxColors,
          palette: [[0,0,0],[64,64,64],[128,128,128],[255,255,255]]
        });

        // we store data about every pixel on the canvas, regardless of whether
        // it has been knit. this handles the "empty" (transparent) stitches
        let totalPixels = pixelColors.reduce((a,b) => a + (!b.includes("rgba(") ? 1 : 0), 0)

        // pixelColors.splice(totalPixels);
        // console.log(pixelColors.length);

        let UIntArray = RGBArrayToUIntArray(pixelColors);

        // console.log(UIntArray);
        q.sample(UIntArray, pixelCount)
       
        // console.log(UIntArrayToRGBArray(q.palette(false,true)));
        // console.log(q);
        
        let newPixelColors = UIntArrayToRGBArray(q.reduce(UIntArray));
      
        pixelCanvas.width = pixelCount;
        pixelCanvas.height = Math.ceil(totalPixels/pixelCount);

        const pixelctx = pixelCanvas.getContext('2d');      

        for (let i=0; i<totalPixels; i++) {
          pixelctx.fillStyle = newPixelColors[i];
          let currentRow = Math.floor(i/pixelCount);
          pixelctx.fillRect(i%pixelCount, currentRow, 1, 1);
        }

        zip.file(
          `PixelPattern.png`, 
          pixelCanvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, ""), 
          {base64: true}
        );
    }

    downloadStitchPattern(zip) {
      const {pixelCount, pixelColors} = {...this.props};
      const stitchCanvas = document.createElement('canvas');

      // tally up all stitches that are actually colors
      let totalStitches = pixelColors.reduce((a,b) => a + (!b.includes("rgba(") ? 1 : 0), 0)
      pixelColors.splice(totalStitches); /// removing transparent pixels

      stitchCanvas.width = 25*pixelCount+10;
      stitchCanvas.height = 25*(Math.ceil(totalStitches/pixelCount))+10;

      const stitchctx = stitchCanvas.getContext('2d');

      for (let i=0; i<totalStitches; i++) {
        stitchctx.fillStyle = pixelColors[i];
        let currentRow = Math.floor(i/pixelCount);
        stitchctx.drawStitch(25*(i%pixelCount), 25*currentRow, 20);
      }

      zip.file(
        `KnitPattern.png`, 
        stitchCanvas.toDataURL("image/jpeg").replace(/^data:image\/(png|jpg);base64,/, ""), 
        {base64: true}
      );
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
    projectName: state.projectState.currentProjectName,
    downloadingStitches: state.pixels.downloadingStitches,
    downloadingStitchesName: state.pixels.downloadingStitchesName
});

const mapDispatchToProps = dispatch => ({
    openImageExport : () => dispatch(openImageExport()),
    triggerDownload: () => dispatch(downloadTheStitches(true)),
    toggleDownloadStitches: () => dispatch(downloadTheStitches(false)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SimulatorTools);
