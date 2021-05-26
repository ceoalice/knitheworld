import PropTypes from 'prop-types';
import React from 'react';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import JSZip from "jszip";
import { saveAs } from 'file-saver';

import styles from "./modal.css"

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    position: 'absolute',
    display: 'flex',
    flexDirection : "column",
    alignItems : "center",
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const DownloadModalComponent = (props) => {  
  const [modalStyle] = React.useState(getModalStyle);

  const [state, setState] = React.useState({
    thumbnail: false,
    xml: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleSubmit= (e) => {
    let zip = new JSZip();
    // console.log(props.xml);
    if (state.xml) { 
      zip.file(`${props.name}.xml`, props.xml);
    }

    if (state.thumbnail) { // && !props.isExample
      zip.file(
        `thumbnail.png`, 
        props.iconURL.replace(/^data:image\/(png|jpg);base64,/, ""), 
        {base64: true}
      );
    }

    if (state.xml || state.thumbnail) {
      zip.generateAsync({type:"blob"})
        .then(function(content) {
            // see FileSaver.js
            saveAs(content, `${props.name}.zip`);
        });
    }

    props.handleClose(e);
  }

  const { thumbnail, xml } = state;
  
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Card style={modalStyle} className={styles.card} onClick={(ev)=> ev.stopPropagation()}>
        <CardHeader
          title="Download Project"
        />
        <CardContent className={styles.downloadContent}>
          <FormControl className={styles.margin}>
            <FormLabel component="legend">Select Files to Download</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox color= "default" checked={thumbnail} onChange={handleChange} name="thumbnail" />}
                label="Thumbnail"
              />
              <FormControlLabel
                control={<Checkbox color= "default" checked={xml} onChange={handleChange} name="xml" />}
                label="XML file"
              />
            </FormGroup>
          </FormControl>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Download
          </Button>
        </CardContent>  
      </Card>
    </Modal>
  )
}

DownloadModalComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  xml: PropTypes.string.isRequired,
  iconURL: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Promise)
  ]),

};

export default DownloadModalComponent;