import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import styles from './image-importer.scss';

const ImageImporterComponent = (props) => {
    return (
        <div className={styles.testForm}>
          <form className={styles.testForm} onSubmit={props.handleSubmit}>
            <input type="file"
              onChange={props.onDrop}
              accept="image/png, image/jpeg"
            />
            <div className={styles.flexRow} style={{display: 'flex', flexDirection:'row'}}>
              <TextField
                className={styles.numberInput}
                label="Number of Pixels Wide:"
                name="numPixels"
                type="number"
                value={props.numPixels}
                onChange={props.handleInputChange}
                variant="outlined" 
              />
              <TextField
                className={styles.numberInput}
                label="Max Number of Colors:"
                name="numColors"
                type="number"
                value={props.numColors}
                onChange={props.handleInputChange} 
                variant="outlined"
              />
            </div>
            <Button type="submit" className={styles.previewButton}> Preview </Button>
          </form>

          <div className={styles.canvasContainer}> 
            <canvas 
              ref={props.canvasRef} id="final" 
              width={`${props.BASE_CANVAS_WIDTH}px`} 
              height={`${props.BASE_CANVAS_WIDTH}px`}>
            </canvas>
          </div>

          <Button className={styles.uploadButton} onClick={props.export}> Upload </Button>
        </div>
    );
};


ImageImporterComponent.propTypes = {
  numPixels: PropTypes.number.isRequired,
  numColors: PropTypes.number.isRequired,
  BASE_CANVAS_WIDTH : PropTypes.number.isRequired,

  onDrop: PropTypes.func.isRequired, 
  handleInputChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  export: PropTypes.func.isRequired,
}

export default ImageImporterComponent;