import PropTypes from 'prop-types';
import React from 'react';
import RgbQuant from "rgbquant";
import { bindAll } from 'lodash';

import ProjectAPI from '../lib/project-api.js';
import { blocksToXML, RGBToHex } from "../lib/image-import";

import ImageImporterComponent from "../components/image-importer/image-importer";

class ImageImporter extends React.Component {
    constructor(props) {
        super(props);
         this.state = { 
          canvasFilled : false,
          src: null,
          numPixels : 10,
          numColors : 2,
          bounds: {
            numPixels : [1, 50],
            numColors : [1, 25]
          },
          errors: {
            numPixels : false,
            numColors : false
          },
          // quantized Image Data (post-quantization)
          qData : null,
          qWidth : 0,
          qHeight : 0,          
          // resized Image Data
          rData : null,
          rWidth : 0,
          rHeight : 0
        };

      this.finalCanvasRef = React.createRef();
      this.midCanvasRef= React.createRef();
      bindAll(this,[
        'onDrop',
        'handleInputChange',
        'handleSubmit',
        'export',
        'quantize',
        'resizeData'
      ])
    }

    /**
     * TODO : rename this, refactor, cleanup and ad dev option for seeing quantized image on ANOTHER canvas
     */
    updateCanvases() {
      // draw resized
      this.drawToCanvas(this.finalCanvasRef,this.state.rData,this.state.rWidth,this.state.rHeight);

      this.drawToCanvas(this.midCanvasRef,this.state.qData,this.state.qWidth,this.state.qHeight); 

      this.setState({})
    }

    drawToCanvas(ref, data, width, height) {
      let factor = width/this.props.BASE_CANVAS_WIDTH;
      let ctx = ref.current.getContext('2d'); 

      ctx.canvas.width = this.props.BASE_CANVAS_WIDTH; 
      ctx.canvas.height = Math.ceil(height / factor); 

      let pixelWidth = 1.0/factor;
      let x = 0, y = 0; 

      for ( let i = 0; i < data.length-3; i+=4) {
        ctx.fillStyle = `rgba(${data[i]},${data[i+1]},${data[i+2]},${(data[i+3]/255)})`;
        ctx.strokeStyle = `rgba(${data[i]},${data[i+1]},${data[i+2]},${(data[i+3]/255)})`;
        
        ctx.fillRect( x*pixelWidth , y*pixelWidth, 0.9*pixelWidth, 0.9*pixelWidth);

        x+=1;
        if (x === width) {
          x = 0;
          y += 1;
        }
      }
    }

    resizeData() {
      let rWidth = Number(this.state.numPixels); // sometimes numPixels saved as string of a number
      let factor = this.state.qWidth/rWidth;
      let rHeight = Math.ceil(this.state.qHeight / factor); 
      let rData = [];

      for ( let y = 0; y < rHeight; y+=1) {
        for ( let x = 0; x < rWidth; x+=1) {
          let qx = Math.floor(x*factor);
          let qy = Math.floor(y*factor);

          let i = (qx*4 + this.state.qWidth*4*qy); 
          rData.push(
            this.state.qData[i],
            this.state.qData[i+1],
            this.state.qData[i+2],
            this.state.qData[i+3]
          );
        }
      }
      this.setState({rData, rWidth, rHeight}, this.updateCanvases);
    }
    
    async quantize() {
      let q = new RgbQuant({
        colors: Number(this.state.numColors), // sometimes numColors saved as string of a number
      });

      let img = new Image();
      img.src = this.state.src;

      img.onload  = () => {
        q.sample(img);
        const data = q.reduce(img);
        this.setState({
          // loading : false,
          qData : data,
          qWidth : img.width,
          qHeight : img.height
        }, this.resizeData);
      }
    }

    export() {
      let  blocks = [];
      let x = 0;
      let count = 0;
      let color = null
      for ( let i = 0; i < this.state.rData.length-3; i+=4) {
        let newColor = RGBToHex(this.state.rData[i],this.state.rData[i+1],this.state.rData[i+2])
        
        if (color !== newColor) {
          if (color !== null) blocks.push([color, count]);
          color = newColor;
          count = 1;
        } else {
          count += 1;
        }

        x+=1;
        if (x === this.state.rWidth) {
          blocks.push([color, count])
          blocks.push("END_ROW");

          x = 0;
          count = 0;
          color = null;
        }
      }
      
      let xmlString = blocksToXML(blocks);
      this.props.closeModal();
      ProjectAPI.newProject(xmlString);
    }

    onDrop(event, err) {
      if (event.target.files[0]) {
        let src = URL.createObjectURL(event.target.files[0]);

        if (src) {
          console.log("FILE DROPPED");
          this.setState({src});
        }
      }
    }

    handleInputChange(event) {
      const target = event.target;
      const value = Number(target.value);
      const name = target.name;
      const errors = {...this.state.errors};
      const bounds = {...this.state.bounds};

      if (isNaN(value)) { // NaN error
        this.setState({errors : {...errors, [name] : "NaN" }});
      } else if ( value < bounds[name][0] || value > bounds[name][1] ) { //bounds error
        this.setState({errors : {...errors, [name] : "bounds" }});
      } else if (errors[name]) {
        this.setState({errors : {...errors, [name] : false }});
      }
      
      this.setState({[name]: target.value});
    }

    handleSubmit(event) {
      if (!this.state.errors.numColors && !this.state.errors.numColors) {
        this.quantize();
        this.setState({canvasFilled : true});
      }
      event.preventDefault();
    }

    render() {
        return (
          <ImageImporterComponent
            finalCanvasRef={this.finalCanvasRef}
            midCanvasRef={this.midCanvasRef}
            numPixels={this.state.numPixels}
            numColors={this.state.numColors}
            errors={this.state.errors}
            bounds={this.state.bounds}
            canvasFilled={this.state.canvasFilled}

            onDrop={this.onDrop}
            handleInputChange={this.handleInputChange}
            handleSubmit={this.handleSubmit}
            export={this.export}
            {...this.props}
          />
        );
    }
}

ImageImporter.propTypes = {
  BASE_CANVAS_WIDTH : PropTypes.number.isRequired
}

ImageImporter.defaultProps = {
  BASE_CANVAS_WIDTH : 400
}

export default ImageImporter;