import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import styles from './image-importer.scss';

const ImageImporterComponent = (props) => {
    return (
        <div className={styles.testForm}>
        <form className={styles.testForm} onSubmit={props.handleSubmit}>
          <input type="file"
                id="avatar" name="avatar"
                onChange={props.onDrop}
                accept="image/png, image/jpeg">
          </input>
          <label>
            Number of Pixels Wide:
            <input
              name="numPixels"
              type="number"
              min="1" max="100"
              value={props.numPixels}
              onChange={props.handleInputChange} 
              />
          </label>
          <label>
            Max Number of Colors:
            <input
              name="numColors"
              type="number"
              min="1" max="256"
              value={props.numColors}
              onChange={props.handleInputChange} 
              />
          </label>
          <input type="submit" value="Submit" />
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