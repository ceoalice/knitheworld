import React from 'react';
import {connect} from 'react-redux';
import { bindAll } from "lodash";

import RgbQuant from "rgbquant";
import SimulatorToolsComponent from '../components/simulator-tools/simulator-tools.js';

import JSZip from "jszip";
import { saveAs } from 'file-saver';

import ProjectAPI from "../lib/project-api.js";
import ImageManager from "../lib/image-manager.js";

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
          showMinecraft : false
        }

        bindAll(this, [
          'downloadPixelPattern',
          'downloadStitchPattern',
          // 'toggleDownload',
          'savePattern',
          'download',
          'saveThumbnail',
          'downloadMinecraft',
          'getCurrentStitchCanvas'
        ]);
    }

    componentDidMount() {
      let params = new URLSearchParams(window.location.search)
      if (params.has('minecraft')) {
        this.setState({showMinecraft : true});
      }
    }

    componentDidUpdate() {
      if (this.props.downloadingStitches){
        this.toggleDownload();
        console.log("downloading stitches!");
      }
    }

    savePattern(action) {
      switch(action) {
        case "download":
          this.download();
          break;
        case 'thumbnail':
          this.saveThumbnail();
          break;
        case 'minecraft':
          this.downloadMinecraft();
          break;
        default:
          break;
      }
    }

    saveThumbnail() {
      let imgData = this.getCurrentStitchCanvas().toDataURL();
      ImageManager.saveProjectImage(ProjectAPI.getCurrentID(),imgData);
    }

    download() {
      let zip = new JSZip();

      this.downloadPixelPattern(zip);
      this.downloadStitchPattern(zip);

      zip.generateAsync({type:"blob"})
      .then((content) => {
          // see FileSaver.js
          saveAs(content, `${this.props.projectName}.zip`);
      });
    }

    downloadMinecraft() {

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
          // palette: [[0,0,0],[64,64,64],[128,128,128],[255,255,255]]
          palette: [[0,0,0],[255,255,255]]
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

    getCurrentStitchCanvas() {
      const {pixelCount, pixelColors} = {...this.props};
      const stitchCanvas = document.createElement('canvas');

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

      return stitchCanvas;
    }

    downloadStitchPattern(zip) {
      const stitchCanvas = this.getCurrentStitchCanvas();

      zip.file(
        `KnitPattern.png`, 
        stitchCanvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, ""), 
        {base64: true}
      );
    }

    render() {
        return (
            <SimulatorToolsComponent 
              showMinecraft={this.state.showMinecraft} 
              savePattern = {this.savePattern} 
              {...this.props} 
            />
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


export default connect(mapStateToProps)(SimulatorTools);
