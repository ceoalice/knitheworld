import PropTypes from 'prop-types';
import React from 'react';
import RgbQuant from "rgbquant";
import { bindAll } from 'lodash';

import ProjectManager from '../lib/project-manager';
import { blocksToXML, RGBToHex } from "../lib/image-import"

import ImageImporterComponent from "../components/image-importer/image-importer";

class ImageImporter extends React.Component {
    constructor(props) {
        super(props);
         this.state = { 
          src: null,
          numPixels : 10,
          numColors : 2,
          // quantized Image Data (post-quantization)
          qData : null,
          qWidth : 0,
          qlHeight : 0,          
          // resized Image Data
          rData : null,
          rWidth : 0,
          rHeight : 0
        };

      this.canvasRef = React.createRef();
      bindAll(this,[
        'onDrop',
        'handleInputChange',
        'handleSubmit',
        'export',
        'quantize',
        'resizeData'
      ])
    }

    RGBAToCanvas() {
      let data = this.state.rData;
      let factor = this.state.rWidth/this.props.BASE_CANVAS_WIDTH;
      let ctx = this.canvasRef.current.getContext('2d'); 

      ctx.canvas.width = this.props.BASE_CANVAS_WIDTH; 
      ctx.canvas.height = Math.ceil(this.state.rHeight / factor); 

      let pixelWidth = 1.0/factor;
      let x = 0, y = 0; 

      for ( let i = 0; i < data.length-3; i+=4) {
        ctx.fillStyle = "rgba("+data[i]+","+data[i+1]+","+data[i+2]+","+(data[i+3]/255)+")";
        ctx.strokeStyle = "rgba("+data[i]+","+data[i+1]+","+data[i+2]+","+(data[i+3]/255)+")";
        
        ctx.fillRect( x*pixelWidth , y*pixelWidth, 0.98*pixelWidth, 0.98*pixelWidth);

        x+=1;
        if (x === this.state.rWidth) {
          x = 0;
          y += 1;
        }
      }
    }

    resizeData() {
      let factor = this.state.qWidth/this.state.numPixels;

      let rWidth = this.state.numPixels;
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
      this.setState({rData, rWidth, rHeight})
    }
    
    quantize(src) {
      console.log("QUANTIZING");
      let q = new RgbQuant({
        colors: this.state.numColors,
      });

      let img = new Image();
      img.src = src;

      img.onload  = () => {
        q.sample(img);
        const data = q.reduce(img);
        this.setState({
          qData : data,
          qWidth : img.width,
          qHeight : img.height
        })
        this.resizeData();
        this.RGBAToCanvas();
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
      ProjectManager.newProject(xmlString);
    }

    onDrop(event, err) {
      let src = URL.createObjectURL(event.target.files[0]);

      if (src) {
        console.log("FILE DROPPED");
        this.setState({src});
      }
    }

    handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
        [name]: Number(value)
      });
    }

    handleSubmit(event) {
      this.quantize(this.state.src);
      event.preventDefault();
    }

    render() {
        return (
          <ImageImporterComponent
            onDrop={this.onDrop}
            canvasRef={this.canvasRef}
            numPixels={this.state.numPixels}
            numColors={this.state.numColors}
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