import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import ProjectItemComponent from '../components/project-item/project-item.js';
import ImageManager from "../lib/image-manager.js"


class ProjectItem extends React.PureComponent {
    constructor (props) {
        super(props);
        this.state = {
          imageURL : ""
        }
        bindAll(this, [
            'handleClick',
            'handleClickClose',
            'handleUpdate'
        ]);
    }

    componentDidMount() {      
      this.handleUpdate();
    }
    componentDidUpdate() {
      this.handleUpdate();
    }

    async handleUpdate() {
      let imageURL = this.props.isExample 
      ? ImageManager.getSampleImage(this.props.project.id)
      : await ImageManager.getProjectImageURL(this.props.project.id)
      this.setState({imageURL});
    }


    handleClick (e) {
      if (!this.props.disabled) {
        this.props.onSelect(this.props.id);
      }
      e.preventDefault();
    }

    handleClickClose (e) {
      if (!this.props.disabled) {
        this.props.onDelete(this.props.id);
      }
      e.preventDefault();
      e.stopPropagation(); // prevent handleClick from firing
    }
    render () {
        return (
            <ProjectItemComponent
                onClick={this.handleClick}
                onClickClose={this.handleClickClose}
                iconURL={this.state.imageURL}
                {...this.props}
            />
        );
    }
}
// PropTypes.oneOfType([
ProjectItem.propTypes = {

    project: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      xml: PropTypes.string.isRequired,
      size: PropTypes.number,
      timestamp: PropTypes.object
    }).isRequired,

    hidden: PropTypes.bool,
    isExample: PropTypes.bool,
    onDelete: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  pixelCount: state.pixels.pixelCount,
  pixelColors: state.pixels.pixelColors,
  rowCount: state.pixels.rowCount
});


export default connect(
  mapStateToProps
)(ProjectItem);
