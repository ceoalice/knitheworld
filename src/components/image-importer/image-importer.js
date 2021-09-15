import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import styles from './image-importer.scss';

import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';

const ImageImporterComponent = (props) => {
    return (
        <div className={styles.imageForm}>
          <form className={styles.imageForm} onSubmit={props.handleSubmit}>
            <input
              className={styles.fileInput}
              type="file"
              onChange={props.onDrop}
              accept="image/png, image/jpeg"
            />
            <div className={styles.flexRow}>
              <TextField
                error={Boolean(props.errors.numPixels)}
                helperText={props.errors.numPixels && 
                  (props.errors.numPixels == "NaN" 
                    ? "Needs to be a Number" 
                    : `Value Bounds: (${props.bounds.numPixels[0]}, ${props.bounds.numPixels[1]}).`)}

                className={styles.numberInput}
                label="Number of Pixels Wide:"
                name="numPixels"
                value={props.numPixels}
                onChange={props.handleInputChange}
                variant="outlined"
              />
              <TextField
                error={Boolean(props.errors.numColors)}
                helperText={props.errors.numColors && 
                  (props.errors.numColors == "NaN" 
                    ? "Needs to be a Number" 
                    : `Value Bounds: (${props.bounds.numColors[0]}, ${props.bounds.numColors[1]}).`)}

                className={classNames(styles.numberInput, styles.rightInput)}
                label="Max Number of Colors:"
                name="numColors"
                value={props.numColors}
                onChange={props.handleInputChange} 
                variant="outlined"
              />
            </div>
            <Button type="submit" className={styles.previewButton}> Preview </Button>
          </form>

          <Carousel interval={props.canvasFilled ? 5000 : null}>
            <Carousel.Item>
              <div className={styles.canvasContainer}> 
                <canvas 
                  ref={props.finalCanvasRef} id="final" 
                  width={`${props.BASE_CANVAS_WIDTH}px`} 
                  height={`${props.BASE_CANVAS_WIDTH}px`}
                />
              </div>
              <Carousel.Caption>
                <p>Knit Pattern</p>
              </Carousel.Caption>
            </Carousel.Item>
    
            <Carousel.Item>
              <div className={styles.canvasContainer}>
                  <canvas 
                    ref={props.midCanvasRef} id="middle" 
                    width={`${props.BASE_CANVAS_WIDTH}px`} 
                    height={`${props.BASE_CANVAS_WIDTH}px`}
                  />
                </div>
              <Carousel.Caption>
                <p>Color Reduced Image</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
          <Button className={styles.uploadButton} onClick={props.export}> Upload </Button>
        </div>
    );
};


ImageImporterComponent.propTypes = {
  numPixels: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  numColors: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  BASE_CANVAS_WIDTH : PropTypes.number.isRequired,
  errors : PropTypes.object.isRequired,
  canvasFilled : PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired, 
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  export: PropTypes.func.isRequired,
}

export default ImageImporterComponent;